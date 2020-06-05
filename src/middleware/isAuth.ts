import { RequestHandler } from 'express'

export const isAuth: RequestHandler = async (req, res, next) => {
	if (!req.session!.isLoggedIn) {
		console.log('Please Login...')
		return res.redirect('/login')
	}
	next()
}
