import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import inventoryRoutes from './inventoryRoutes';
import orderRoutes from './orderRoutes';
import customerRoutes from './customerRoutes';
import sellerRoutes from './sellerRoutes';
import analyticsRoutes from './analyticsRoutes';
import reportRoutes from './reportRoutes';
import bulkRoutes from './bulkRoutes';
import auditRoutes from './auditRoutes';
import notificationRoutes from './notificationRoutes';
import settingsRoutes from './settingsRoutes';
import categoryRoutes from './categoryRoutes';
import searchRoutes from './searchRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/sellers', sellerRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/bulk', bulkRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);

export default router;
