import { RequestHandler } from 'express'
import User from '../models/user'
import { hash, compare } from 'bcryptjs'
import { getErrorMessage } from '../utils/getFlashError'
import { MailService } from '../utils/MailService'
import { randomBytes } from 'crypto'

export const getLoginPage: RequestHandler = (req, res, _next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: getErrorMessage(req),
	})
}

export const postLogin: RequestHandler = async (req, res, _next) => {
	const email = req.body.email
	const password = req.body.password
	const user = await User.findOne({ email: email })

	if (!user) {
		req.flash('error', 'Invalid Email or password!')
		// Some times it take time to save in session hence its good to use callbac format like this
		req.session?.save((_) => res.redirect('/login'))
	} else {
		if (await compare(password, (user as any).password)) {
			req.session!.user = user
			req.session!.isLoggedIn = true
			req.session?.save((_) => res.redirect('/'))
		} else {
			req.flash('error', 'Invalid Email or password!')
			req.session?.save((_) => res.redirect('/login'))
		}
	}
}

export const postLogout: RequestHandler = (req, res, _next) => {
	req.session?.destroy((err) => {
		console.log('Session cleared...')
		res.redirect('/')
	})
}

export const getSignup: RequestHandler = (req, res, _next) => {
	res.render('auth/signup', {
		path: 'signup',
		pageTitle: 'Signup',
		errorMessage: getErrorMessage(req),
	})
}

export const postSignup: RequestHandler = async (req, res, _next) => {
	const email = req.body.email
	const password = req.body.password
	const confirmPassword = req.body.confirmPassword

	// Check if email exists in DB
	const user = await User.findOne({ email: email })
	if (user) {
		req.flash('error', 'Email already exists, pick different one')
		req.session?.save((_) => res.redirect('/signup'))
	} else {
		const user = new User({
			email: email,
			password: await hash(password, 12),
			cart: { items: [] },
		})

		await user.save()
		res.redirect('/login')
		try {
			await MailService.sendMail({
				to: email,
				from: 'nodeshop393@gmail.com',
				subject: 'Regarding Signup',
				html: '<strong>Account successfully Created...</strong>',
			})

			console.log('Email Sent...')
		} catch (err) {
			console.log('Error in sending mail...')
			console.log(err.response.body)
		}
	}
}

export const getReset: RequestHandler = (req, res, _next) => {
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: getErrorMessage(req),
	})
}

export const postReset: RequestHandler = (req, res, _next) => {
	randomBytes(32, async (err, buf) => {
		if (err) {
			console.log(err)
			return res.redirect('/reset')
		}
		const email = req.body.email
		const token = buf.toString('hex')
		const user = await User.findOne({ email: email })

		if (!user) {
			req.flash('error', 'No account with that Email Found.')
			return req.session?.save((_) => res.redirect('/reset'))
		}

		;(user as any).resetToken = token
		;(user as any).resetTokenExpiration = Date.now() + 3600000
		await user.save()

		res.redirect('/')
		await MailService.sendMail({
			to: email,
			from: 'shop@node.com',
			subject: 'Password Reset',
			html: `
				<h2> You requested a password Reset</h2>
				<p>Click this  <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>

			`,
		})

		console.log('Reset Password Email Sent...')
	})
}

export const getNewPassword: RequestHandler = async (req, res, _next) => {
	const token = req.params.token
	const user = await User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
	})

	if (user) {
		return res.render('auth/new-password', {
			path: '/new-password',
			pageTitle: 'Update Password',
			errorMessage: getErrorMessage(req),
			userId: user?._id.toString(),
			token: token,
		})
	} else {
		req.flash('error', 'Invalid Token...Try again')
		return req.session?.save((_) => res.redirect('/reset'))
	}
}

export const postNewPassword: RequestHandler = async (req, res, _next) => {
	const userId = req.body.userId
	const password = req.body.password
	const token = req.body.token

	const user = await User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})

	;(user as any).password = await hash(password, 12)
	;(user as any).resetToken = null
	;(user as any).resetTokenExpiration = null

	await user?.save()
	console.log('Password Changed Successfully...')
	res.redirect('/login')
}
