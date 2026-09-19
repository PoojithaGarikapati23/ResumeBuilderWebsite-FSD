import { Router } from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT, requireSellerOrAdmin);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);

export default router;
