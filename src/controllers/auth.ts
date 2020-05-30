import { RequestHandler } from 'express';
import User from '../models/user';

export const getLoginPage: RequestHandler = (req, res, _next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false,
	});
};

export const postLogin: RequestHandler = async (req, res, _next) => {
	req.session!.user = await User.findById('5ed0f6410abd5e2f351c84a5');
	req.session!.isLoggedIn = true;
	req.session?.save(_ => res.redirect('/'));
};

export const postLogout: RequestHandler = (req, res, _next) => {
	req.session?.destroy(err => {
		console.log('Session cleared...');
		res.redirect('/');
	});
};
