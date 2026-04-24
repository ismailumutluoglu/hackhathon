import { Router } from 'express';
import { authMiddleware, adminOrProducerMiddleware } from '../middlewares/auth.middleware';
import {
  getProducts, getFeaturedProducts, getCampaignProducts,
  getProduct, createProduct, updateProduct, deleteProduct, addReview,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/campaigns', getCampaignProducts);
router.get('/:slug', getProduct);

router.post('/', authMiddleware, adminOrProducerMiddleware, createProduct);
router.patch('/:id', authMiddleware, adminOrProducerMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminOrProducerMiddleware, deleteProduct);
router.post('/:id/reviews', authMiddleware, addReview);

export default router;
