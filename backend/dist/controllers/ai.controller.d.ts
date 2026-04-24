import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare function getRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function submitFeedback(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getAdminLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=ai.controller.d.ts.map