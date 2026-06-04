import { Router } from 'express';
import { listTasks, getTask, startTask, submitTask, getMyTasks } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, listTasks);
router.get('/my', authMiddleware, getMyTasks);
router.get('/:id', authMiddleware, getTask);
router.post('/:id/start', authMiddleware, startTask);
router.post('/:id/submit', authMiddleware, submitTask);

export default router;
