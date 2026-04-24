import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { User } from '../models/User';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export async function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Oturum açmanız gerekiyor.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role: string };

    const user = await User.findById(decoded.id).select('_id role isActive');
    if (!user || !user.isActive) {
      throw new AppError('Kullanıcı bulunamadı veya hesap aktif değil.', 401);
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Geçersiz veya süresi dolmuş token.', 401));
  }
}

export function adminMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (req.userRole !== 'admin') {
    return next(new AppError('Bu işlem için admin yetkisi gerekiyor.', 403));
  }
  next();
}
