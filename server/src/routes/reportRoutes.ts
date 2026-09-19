import { Router } from 'express';
import { getReportData } from '../controllers/reportController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT, requireSellerOrAdmin);

router.get('/', getReportData);

export default router;
