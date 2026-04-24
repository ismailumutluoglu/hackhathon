import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export function signToken(id: string, role: string): string {
  return jwt.sign({ id, role }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN as any });
}
