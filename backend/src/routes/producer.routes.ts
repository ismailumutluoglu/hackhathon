import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { getProducers, getProducer, createProducer, updateProducer, deleteProducer } from '../controllers/producer.controller';

const router = Router();

router.get('/', getProducers);
router.get('/:slug', getProducer);

router.post('/', authMiddleware, adminMiddleware, createProducer);
router.patch('/:id', authMiddleware, adminMiddleware, updateProducer);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProducer);

export default router;
