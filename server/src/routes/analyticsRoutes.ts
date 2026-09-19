import { Router } from 'express';
import {
  getOverview,
  getRevenueTrend,
  getCategorySales,
  getTopProducts,
  getSellerPerformance,
} from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT, requireSellerOrAdmin);

router.get('/overview', getOverview);
router.get('/revenue-trend', getRevenueTrend);
router.get('/category-sales', getCategorySales);
router.get('/top-products', getTopProducts);
router.get('/seller-performance', getSellerPerformance);

export default router;
