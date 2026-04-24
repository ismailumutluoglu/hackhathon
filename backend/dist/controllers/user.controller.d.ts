import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateHealthProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function addAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map