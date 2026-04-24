import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId).select('-__v');
    if (!user) throw new AppError('Kullanıcı bulunamadı.', 404);
    res.json({ success: true, user });
  } catch (err) { next(err); }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-__v');
    res.json({ success: true, user });
  } catch (err) { next(err); }
}

export async function updateHealthProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { healthProfile: req.body },
      { new: true, runValidators: true }
    ).select('healthProfile');
    res.json({ success: true, healthProfile: user?.healthProfile });
  } catch (err) { next(err); }
}

export async function addAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('Kullanıcı bulunamadı.', 404);

    // İlk adres otomatik varsayılan olsun
    if (user.addresses.length === 0) req.body.isDefault = true;
    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
}

export async function updateAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('Kullanıcı bulunamadı.', 404);

    const addr = user.addresses.id(req.params.id);
    if (!addr) throw new AppError('Adres bulunamadı.', 404);

    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
}

export async function deleteAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('Kullanıcı bulunamadı.', 404);

    user.addresses = user.addresses.filter(
      (a: any) => a._id.toString() !== req.params.id
    );
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
}
