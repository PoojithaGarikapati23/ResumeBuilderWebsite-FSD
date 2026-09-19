import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
} from '../controllers/productController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSellerOrAdmin } from '../middleware/rbacMiddleware';

const router = Router();

// Public / browse products (supports public customer catalog)
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateJWT(req, res, next);
  }
  next();
}, getProducts);

router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateJWT(req, res, next);
  }
  next();
}, getProductById);

// Protected routes
router.post('/', authenticateJWT, requireSellerOrAdmin, createProduct);
router.put('/:id', authenticateJWT, requireSellerOrAdmin, updateProduct);
router.delete('/:id', authenticateJWT, requireSellerOrAdmin, deleteProduct);
router.post('/:id/duplicate', authenticateJWT, requireSellerOrAdmin, duplicateProduct);

export default router;
