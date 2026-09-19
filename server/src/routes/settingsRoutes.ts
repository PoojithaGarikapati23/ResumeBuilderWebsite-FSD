import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSuperAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateJWT, requireSuperAdmin, updateSettings);

export default router;
