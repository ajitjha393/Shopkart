import { Router } from 'express';
import {
	getLoginPage,
	postLogout,
	postLogin,
	getSignup,
	postSignup,
	getReset,
	postReset,
	getNewPassword,
} from '../controllers/auth';

const router = Router();

router.get('/login', getLoginPage);
router.post('/login', postLogin);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset', getReset);
router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);
export default router;
