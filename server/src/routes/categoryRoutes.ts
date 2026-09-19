import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSuperAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateJWT, requireSuperAdmin, createCategory);

export default router;
