import { Router } from 'express';
import { getInventory, adjustStock, getInventoryHistory } from '../controllers/inventoryController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT, requireSellerOrAdmin);

router.get('/', getInventory);
router.post('/:id/adjust', adjustStock);
router.get('/:id/history', getInventoryHistory);

export default router;
