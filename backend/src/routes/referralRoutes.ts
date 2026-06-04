import { Router } from 'express';
import { getReferralStats, getReferralList } from '../controllers/referralController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authMiddleware, getReferralStats);
router.get('/list', authMiddleware, getReferralList);

export default router;
