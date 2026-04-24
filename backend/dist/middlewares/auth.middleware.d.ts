import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}
export declare function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction): Promise<void>;
export declare function adminMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function adminOrProducerMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map