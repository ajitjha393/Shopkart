import { Router } from 'express';
import { getLoginPage, postLogout, postLogin } from '../controllers/auth';

const router = Router();

router.get('/login', getLoginPage);

router.post('/login', postLogin);
router.post('/logout', postLogout);

export default router;
