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
	[
		body('email').isEmail().withMessage('Please Enter A Valid Email '),
		body('password')
			.isLength({ min: 5 })
			.withMessage('Password must be of atleast 5 characters ')
			.isAlphanumeric()
			.withMessage('Password must contain only Alphanumeric Character '),
	],
	postSignup
)

router.post('/logout', postLogout)

router.get('/reset', getReset)
router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)
router.post('/new-password', postNewPassword)

export default router
