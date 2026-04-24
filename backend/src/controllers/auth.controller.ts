import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) throw new AppError('Ad, email ve şifre zorunludur.', 400);

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Bu email adresi zaten kullanımda.', 400);

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email ve şifre zorunludur.', 400);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Email veya şifre hatalı.', 401);
    }
    if (!user.isActive) throw new AppError('Hesabınız aktif değil.', 403);

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id.toString(), user.role);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId).select('-__v');
    if (!user) throw new AppError('Kullanıcı bulunamadı.', 404);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}
