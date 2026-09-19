import { Router } from 'express';
import { getSellers, getSellerById, updateSellerStatus } from '../controllers/sellerController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSuperAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);

// Super Admin / Staff can view and manage sellers
router.get('/', getSellers);
router.get('/:id', getSellerById);
router.put('/:id/status', requireSuperAdmin, updateSellerStatus);

export default router;
