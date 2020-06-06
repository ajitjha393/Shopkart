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
import User from '../models/user'

const router = Router()

router.get('/login', getLoginPage)
router.post(
	'/login',
	[
		body('email')
			.isEmail()
			.withMessage('Please Enter A Valid Email')
			.custom(async (value) => {
				const user = await User.findOne({ email: value })
				if (!user) {
					throw new Error('Email Id does not exists...')
				}
				return true
			})
			.normalizeEmail(),
		body('password')
			.isLength({ min: 5 })
			.withMessage('Password must be of atleast 5 characters ')
			.isAlphanumeric()
			.withMessage('Password must contain only Alphanumeric Character ')
			.trim(),
	],
	postLogin
)

router.get('/signup', getSignup)

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please Enter A Valid Email ')
			.custom(async (value) => {
				const user = await User.findOne({ email: value })
				if (user) {
					throw new Error(
						'Email already exists, please pick a different one'
					)
				}
				return true
			})
			.normalizeEmail(),
		body('password')
			.isLength({ min: 5 })
			.withMessage('Password must be of atleast 5 characters ')
			.isAlphanumeric()
			.withMessage('Password must contain only Alphanumeric Character ')
			.trim(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords Do not Match...')
			}
			return true
		}),
	],
	postSignup
)

router.post('/logout', postLogout)

router.get('/reset', getReset)
router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)
router.post('/new-password', postNewPassword)

export default router
