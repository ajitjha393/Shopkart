import { RequestHandler } from 'express';

export const getLoginPage: RequestHandler = (req, res, _next) => {
	const isLoggedIn = req
		.get('Cookie')
		?.split(';')
		.find(ck => ck.includes('loggedIn'))
		?.split('=')[1];

	console.log(isLoggedIn);

	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: isLoggedIn,
	});
};

export const postLogin: RequestHandler = (req, res, _next) => {
	// req.isLoggedIn = true;
	res.setHeader('Set-Cookie', 'loggedIn=true');
	res.redirect('/');
};
