import { Router } from 'express';
import { login, register, me, logout } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateJWT, me);
router.post('/logout', authenticateJWT, logout);

export default router;
