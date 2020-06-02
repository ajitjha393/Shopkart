import { Router } from 'express';
import {
	getLoginPage,
	postLogout,
	postLogin,
	getSignup,
	postSignup,
	getReset
} from '../controllers/auth';

const router = Router();

router.get('/login', getLoginPage);
router.post('/login', postLogin);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset', getReset);

export default router;
