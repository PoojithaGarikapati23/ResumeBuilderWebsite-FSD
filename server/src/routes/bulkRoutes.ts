import { Router } from 'express';
import {
  importProductsPreview,
  importProductsCommit,
  exportData,
} from '../controllers/bulkController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT, requireSellerOrAdmin);

router.post('/import-preview', importProductsPreview);
router.post('/import-commit', importProductsCommit);
router.get('/export/:entity', exportData);

export default router;
