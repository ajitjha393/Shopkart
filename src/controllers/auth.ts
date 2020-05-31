import { RequestHandler } from 'express';
import User from '../models/user';
import { hash, compare } from 'bcryptjs';
export const getLoginPage: RequestHandler = (req, res, _next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false,
	});
};

export const postLogin: RequestHandler = async (req, res, _next) => {
	const email = req.body.email;
	const password = req.body.password;
	const user = await User.findOne({ email: email });
	if (!user) {
		console.log('Invalid credentials...');
		res.redirect('/login');
	} else {
		if (await compare(password, (user as any).password)) {
			req.session!.user = user;
			req.session!.isLoggedIn = true;
			req.session?.save(_ => res.redirect('/'));
		} else {
			res.redirect('/login');
		}
	}
};

export const postLogout: RequestHandler = (req, res, _next) => {
	req.session?.destroy(err => {
		console.log('Session cleared...');
		res.redirect('/');
	});
};

export const getSignup: RequestHandler = (_req, res, _next) => {
	res.render('auth/signup', {
		path: 'signup',
		pageTitle: 'Signup',
		isAuthenticated: false,
	});
};

export const postSignup: RequestHandler = async (req, res, _next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	// Check if email exists in DB
	const user = await User.findOne({ email: email });
	if (user) {
		console.log('Email already exists...Use another');
		res.redirect('/signup');
	} else {
		const user = new User({
			email: email,
			password: await hash(password, 12),
			cart: { items: [] },
		});

		await user.save();
		res.redirect('/login');
	}
};
