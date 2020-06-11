import { RequestHandler } from 'express'

// Page Not Found
export const get404Page: RequestHandler = (req, res, _next) => {
	res.status(404).render('404', {
		pageTitle: '404 Page Not Found',
		path: null,
		isAuthenticated: req.isLoggedIn,
	})
}

// Server Side error
export const get500Page: RequestHandler = (req, res, _next) => {
	res.status(500).render('500', {
		pageTitle: 'Error!',
		path: null,
		isAuthenticated: req.isLoggedIn,
	})
}
