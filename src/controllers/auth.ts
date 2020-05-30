import { RequestHandler } from 'express';

export const getLoginPage: RequestHandler = (req, res, _next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.isLoggedIn,
	});
};

export const postLogin: RequestHandler = (req, res, _next) => {
	req.isLoggedIn = true;
	res.redirect('/');
};
