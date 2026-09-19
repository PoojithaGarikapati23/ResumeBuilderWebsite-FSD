import { Router } from 'express';
import { globalSearch } from '../controllers/searchController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/', globalSearch);

export default router;
