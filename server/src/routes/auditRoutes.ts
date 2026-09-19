import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT, requireSellerOrAdmin);

router.get('/', getAuditLogs);

export default router;
