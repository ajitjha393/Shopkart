import { RequestHandler } from 'express';

export const getLoginPage: RequestHandler = (req, res, _next) => {
	console.log(req.session!.isLoggedIn);
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session!.isLoggedIn,
	});
};

export const postLogin: RequestHandler = (req, res, _next) => {
	req.session!.isLoggedIn = true;
	res.redirect('/');
};

export const postLogout: RequestHandler = (req, res, _next) => {
	req.session?.destroy(err => {
		console.log('Session cleared...');
		res.redirect('/');
	});
};
