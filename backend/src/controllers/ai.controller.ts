import { Response, NextFunction } from 'express';
import Groq from 'groq-sdk';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { AIRecommendation } from '../models/AIRecommendation';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY || 'missing_key' });

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
      .select('_id name slug images discountedPrice campaignOriginalPrice category tags healthBenefits suitableFor notSuitableFor nutritionFacts price unit');

    const productList = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      suitableFor: p.suitableFor,
      notSuitableFor: p.notSuitableFor,
      healthBenefits: p.healthBenefits,
    }));

    const systemPrompt = `You are the AI nutrition expert for the TAZEKÖY organic food platform. Your task is to provide personalized recommendations from the products on the platform based on the user’s health profile. Provide your responses in Turkish, using a friendly and clear tone. IMPORTANT: Always provide your response in valid JSON format; do not include any additional text. The user’s health profile may include their health conditions, goals, dietary restrictions, allergies, and—optionally—their age, weight, and height. The user may also ask specific questions or describe how they are feeling. Use this information to analyze the current product list and determine which products best meet the user’s needs and which ones they should avoid. For each recommended product, specify a reason and a benefit score (1–10). Explain the reason for products that should be avoided. Additionally, include a summary of your analysis and any additional dietary recommendations. `;

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

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    });

    const processingTimeMs = Date.now() - startTime;
    const rawContent = completion.choices[0]?.message?.content || '{}';

    let parsed;
    try {
      // Groq bazen geriye JSON objesini triple backticks içinde de dönebiliyor (fallback)
      const cleanedContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedContent);
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
      aiProvider: 'groq',
      aiModel: 'llama-3.3-70b-versatile',
      tokensUsed: {
        input: completion.usage?.prompt_tokens || 0,
        output: completion.usage?.completion_tokens || 0,
        total: completion.usage?.total_tokens || 0,
      },
      processingTimeMs,
      isSuccessful: true,
    });

    // Ürün detaylarını populate ederek dön
    const populated = await AIRecommendation.findById(log._id)
      .populate({
        path: 'response.recommendations.product',
        select: 'name slug images price discountedPrice campaignOriginalPrice unit producer',
        populate: { path: 'producer', select: 'name rating location.city' }
      })
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
