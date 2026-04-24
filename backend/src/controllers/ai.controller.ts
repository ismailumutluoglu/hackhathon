import { Response, NextFunction } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { AIRecommendation } from '../models/AIRecommendation';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function getRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const startTime = Date.now();
    const { userQuery } = req.body;

    const user = await User.findById(req.userId).select('healthProfile');
    if (!user) throw new AppError('Kullanıcı bulunamadı.', 404);

    const healthProfile = user.healthProfile;

    // Aktif ürünleri çek (AI prompt için optimize edilmiş alan seçimi)
    const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
      .populate('producer', 'name location.city')
      .select('_id name category tags healthBenefits suitableFor notSuitableFor nutritionFacts price unit');

    const productList = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      suitableFor: p.suitableFor,
      notSuitableFor: p.notSuitableFor,
      healthBenefits: p.healthBenefits,
    }));

    const systemPrompt = `Sen TAZEKÖY organik gıda platformunun yapay zeka diyetisyenisin. Görevin kullanıcının sağlık profiline göre platform ürünleri arasından kişiselleştirilmiş öneriler sunmaktır. Yanıtlarını Türkçe, samimi ve anlaşılır bir dille yap. ÖNEMLI: Yanıtını her zaman geçerli JSON formatında döndür, başka hiçbir metin ekleme.`;

    const userPrompt = `Kullanıcı Sağlık Profili:
- Sağlık durumları: ${healthProfile.conditions?.join(', ') || 'belirtilmemiş'}
- Hedefler: ${healthProfile.goals?.join(', ') || 'belirtilmemiş'}
- Diyet kısıtlamaları: ${healthProfile.dietaryRestrictions?.join(', ') || 'yok'}
- Alerjiler: ${healthProfile.allergies?.join(', ') || 'yok'}
${healthProfile.age ? `- Yaş: ${healthProfile.age}` : ''}
${userQuery ? `\nKullanıcının sorusu: "${userQuery}"` : ''}

Mevcut Ürünler:
${JSON.stringify(productList)}

Aşağıdaki JSON formatında yanıt ver (maksimum 6 öneri, 3 kaçınılacak):
{
  "recommendations": [{"productId":"...","productName":"...","reason":"...","benefitScore":8}],
  "avoidList": [{"productId":"...","productName":"...","reason":"..."}],
  "summary": "Genel özet",
  "dietaryAdvice": "Ek beslenme önerileri"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const processingTimeMs = Date.now() - startTime;
    const rawContent = message.content[0].type === 'text' ? message.content[0].text : '{}';

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new AppError('AI yanıtı işlenemedi. Lütfen tekrar deneyin.', 500);
    }

    // Ürün ID'lerini eşleştir
    const recommendations = (parsed.recommendations || [])
      .map((r: any) => {
        const prod = products.find(p => p._id.toString() === r.productId);
        if (!prod) return null;
        return { product: prod._id, productName: r.productName, reason: r.reason, benefitScore: r.benefitScore };
      })
      .filter(Boolean);

    const avoidList = (parsed.avoidList || [])
      .map((a: any) => {
        const prod = products.find(p => p._id.toString() === a.productId);
        if (!prod) return null;
        return { product: prod._id, productName: a.productName, reason: a.reason };
      })
      .filter(Boolean);

    const sessionId = `${req.userId}-${Date.now()}`;
    const log = await AIRecommendation.create({
      user: req.userId,
      sessionId,
      healthProfileSnapshot: healthProfile,
      userQuery,
      builtPrompt: userPrompt,
      response: {
        recommendations,
        avoidList,
        summary: parsed.summary || '',
        dietaryAdvice: parsed.dietaryAdvice || '',
      },
      aiProvider: 'anthropic',
      aiModel: 'claude-sonnet-4-6',
      tokensUsed: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        total: message.usage.input_tokens + message.usage.output_tokens,
      },
      processingTimeMs,
      isSuccessful: true,
    });

    // Ürün detaylarını populate ederek dön
    const populated = await AIRecommendation.findById(log._id)
      .populate('response.recommendations.product', 'name slug images price discountedPrice unit')
      .populate('response.avoidList.product', 'name slug images');

    res.json({ success: true, recommendation: populated, sessionId });
  } catch (err) { next(err); }
}

export async function getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const history = await AIRecommendation.find({ user: req.userId, isSuccessful: true })
      .sort('-createdAt')
      .limit(10)
      .select('-builtPrompt -__v');
    res.json({ success: true, history });
  } catch (err) { next(err); }
}

export async function submitFeedback(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { rating, feedback } = req.body;
    await AIRecommendation.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { userRating: rating, userFeedback: feedback }
    );
    res.json({ success: true, message: 'Geri bildiriminiz alındı.' });
  } catch (err) { next(err); }
}

export async function getAdminLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      AIRecommendation.find()
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .select('-builtPrompt'),
      AIRecommendation.countDocuments(),
    ]);

    res.json({ success: true, logs, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
}
