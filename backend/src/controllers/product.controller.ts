import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { slugify } from '../utils/slugify';

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12, sort = '-createdAt', isCampaign } = req.query;

    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search as string };
    if (isCampaign === 'true') {
      filter.isCampaign = true;
      filter.campaignEndsAt = { $gt: new Date() };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('producer', 'name slug avatar location.city isVerified')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit))
        .select('-reviews -__v'),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
}

export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true, stock: { $gt: 0 } })
      .populate('producer', 'name slug avatar location.city isVerified')
      .limit(8)
      .select('-reviews -__v');
    res.json({ success: true, products });
  } catch (err) { next(err); }
}

export async function getCampaignProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const products = await Product.find({
      isCampaign: true,
      isActive: true,
      stock: { $gt: 0 },
      campaignEndsAt: { $gt: now },
    })
      .populate('producer', 'name slug avatar location.city isVerified')
      .sort('campaignEndsAt')
      .select('-reviews -__v');
    res.json({ success: true, products });
  } catch (err) { next(err); }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('producer', '-__v')
      .populate('reviews.user', 'name avatar');
    if (!product) throw new AppError('Ürün bulunamadı.', 404);
    res.json({ success: true, product });
  } catch (err) { next(err); }
}

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = slugify(req.body.name);
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
}

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.body.name) req.body.slug = slugify(req.body.name);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) throw new AppError('Ürün bulunamadı.', 404);
    res.json({ success: true, product });
  } catch (err) { next(err); }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Ürün silindi.' });
  } catch (err) { next(err); }
}

export async function addReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError('Ürün bulunamadı.', 404);

    const alreadyReviewed = product.reviews.some(r => r.user.toString() === req.userId);
    if (alreadyReviewed) throw new AppError('Bu ürüne zaten yorum yaptınız.', 400);

    product.reviews.push({ user: req.userId as any, rating: req.body.rating, comment: req.body.comment, createdAt: new Date() });
    product.reviewCount = product.reviews.length;
    product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ success: true, message: 'Yorumunuz eklendi.' });
  } catch (err) { next(err); }
}
