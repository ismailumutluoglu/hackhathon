import { Request, Response, NextFunction } from 'express';
import { Producer } from '../models/Producer';
import { Product } from '../models/Product';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { slugify } from '../utils/slugify';

export async function getProducers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { city, page = 1, limit = 12 } = req.query;
    const filter: any = { isActive: true };
    if (city) filter['location.city'] = city;

    const skip = (Number(page) - 1) * Number(limit);
    const [producers, total] = await Promise.all([
      Producer.find(filter).skip(skip).limit(Number(limit)).select('-story -__v'),
      Producer.countDocuments(filter),
    ]);

    res.json({ success: true, producers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
}

export async function getProducer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const producer = await Producer.findOne({ slug: req.params.slug, isActive: true });
    if (!producer) throw new AppError('Üretici bulunamadı.', 404);

    const products = await Product.find({ producer: producer._id, isActive: true })
      .select('-reviews -__v')
      .limit(12);

    res.json({ success: true, producer, products });
  } catch (err) { next(err); }
}

export async function createProducer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = slugify(req.body.name);
    const producer = await Producer.create({ ...req.body, slug });
    res.status(201).json({ success: true, producer });
  } catch (err) { next(err); }
}

export async function updateProducer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.body.name) req.body.slug = slugify(req.body.name);
    const producer = await Producer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!producer) throw new AppError('Üretici bulunamadı.', 404);
    res.json({ success: true, producer });
  } catch (err) { next(err); }
}

export async function deleteProducer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await Producer.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Üretici silindi.' });
  } catch (err) { next(err); }
}
