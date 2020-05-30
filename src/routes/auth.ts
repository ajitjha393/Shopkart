import { Router } from 'express';
import { getLoginPage, postLogin } from '../controllers/auth';

const router = Router();

router.get('/login', getLoginPage);

router.post('/login', postLogin);

export default router;
