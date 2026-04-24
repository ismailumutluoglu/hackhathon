import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getProfile, updateProfile, updateHealthProfile, addAddress, updateAddress, deleteAddress } from '../controllers/user.controller';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/health-profile', updateHealthProfile);
router.post('/addresses', addAddress);
router.patch('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
