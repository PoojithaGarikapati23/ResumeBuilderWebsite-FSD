import { Router } from 'express';
import { getOrders, getOrderById, updateOrderStatus, createOrder } from '../controllers/orderController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

// Placing order (customer or demo checkout)
router.post('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateJWT(req, res, next);
  }
  next();
}, createOrder);

// Protected order listing and processing
router.use(authenticateJWT);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', requireSellerOrAdmin, updateOrderStatus);

export default router;
