import { Router } from 'express'
import {
	getLoginPage,
	postLogout,
	postLogin,
	getSignup,
	postSignup,
	getReset,
	postReset,
	getNewPassword,
	postNewPassword,
} from '../controllers/auth'
import { body } from 'express-validator'

const router = Router()

router.get('/login', getLoginPage)
router.post('/login', postLogin)

router.get('/signup', getSignup)
router.post(
	'/signup',
	body('email').isEmail().withMessage('Please Enter A Valid Email '),
	postSignup
)

router.post('/logout', postLogout)

router.get('/reset', getReset)
router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)
router.post('/new-password', postNewPassword)

export default router
