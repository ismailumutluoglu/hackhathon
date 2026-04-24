import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { createOrder, getUserOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/order.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getUserOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

router.get('/admin/all', adminMiddleware, getAllOrders);
router.patch('/admin/:id/status', adminMiddleware, updateOrderStatus);

export default router;
