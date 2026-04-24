import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare function getProducers(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProducer(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createProducer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateProducer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteProducer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=producer.controller.d.ts.map