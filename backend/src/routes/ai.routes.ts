import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { getRecommendations, getHistory, submitFeedback, getAdminLogs } from '../controllers/ai.controller';

const router = Router();

router.use(authMiddleware);

router.post('/recommend', getRecommendations);
router.get('/history', getHistory);
router.get('/admin/logs', adminMiddleware, getAdminLogs);
router.patch('/:id/feedback', submitFeedback);

export default router;
