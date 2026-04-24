import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function cancelOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map