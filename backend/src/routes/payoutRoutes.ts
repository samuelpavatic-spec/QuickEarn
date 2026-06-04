import { Router } from 'express';
import { getPayoutMethods, requestPayout, getPayoutHistory } from '../controllers/payoutController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/methods', authMiddleware, getPayoutMethods);
router.post('/request', authMiddleware, requestPayout);
router.get('/history', authMiddleware, getPayoutHistory);

export default router;
