import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import {
  getProducts, getFeaturedProducts, getCampaignProducts,
  getProduct, createProduct, updateProduct, deleteProduct, addReview,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/campaigns', getCampaignProducts);
router.get('/:slug', getProduct);

router.post('/', authMiddleware, adminMiddleware, createProduct);
router.patch('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
router.post('/:id/reviews', authMiddleware, addReview);

export default router;
