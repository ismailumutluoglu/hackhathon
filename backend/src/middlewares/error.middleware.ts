import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    res.status(400).json({ success: false, message: `Bu ${field} zaten kullanımda.` });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map((e: any) => e.message);
    res.status(400).json({ success: false, message: messages.join(', ') });
    return;
  }

  console.error('Beklenmeyen hata:', err);
  res.status(500).json({ success: false, message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.' });
}
