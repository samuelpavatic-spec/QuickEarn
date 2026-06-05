import { Router } from 'express';
import { getConfig, listConfigs } from '../controllers/configController.js';

const router = Router();

router.get('/', listConfigs);
router.get('/:key', getConfig);

export default router;
