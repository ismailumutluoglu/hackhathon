import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare function getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCampaignProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function addReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map