import { RequestHandler } from 'express';
import User from '../models/user';
import { hash, compare } from 'bcryptjs';
import { MailService } from '../utils/MailService';

export const getLoginPage: RequestHandler = (req, res, _next) => {
	let errorMessage = req.flash('error');
	console.log(errorMessage);
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false,
		errorMessage: errorMessage,
	});
};

export const postLogin: RequestHandler = async (req, res, _next) => {
	const email = req.body.email;
	const password = req.body.password;
	const user = await User.findOne({ email: email });

	if (!user) {
		req.flash('error', 'Invalid Email or password!');
		// SOme times it take time to save in session hence its good to use callbac format like this
		req.session?.save(_ => res.redirect('/login'));
	} else {
		if (await compare(password, (user as any).password)) {
			req.session!.user = user;
			req.session!.isLoggedIn = true;
			req.session?.save(_ => res.redirect('/'));
		} else {
			req.flash('error', 'Invalid Email or password!');
			req.session?.save(_ => res.redirect('/login'));
		}
	}
};

export const postLogout: RequestHandler = (req, res, _next) => {
	req.session?.destroy(err => {
		console.log('Session cleared...');
		res.redirect('/');
	});
};

export const getSignup: RequestHandler = (req, res, _next) => {
	let errorMessage = req.flash('error');
	console.log(errorMessage);
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}

	res.render('auth/signup', {
		path: 'signup',
		pageTitle: 'Signup',
		isAuthenticated: false,
		errorMessage: errorMessage,
	});
};

export const postSignup: RequestHandler = async (req, res, _next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	// Check if email exists in DB
	const user = await User.findOne({ email: email });
	if (user) {
		req.flash('error', 'Email already exists, pick different one');
		req.session?.save(_ => res.redirect('/signup'));
	} else {
		const user = new User({
			email: email,
			password: await hash(password, 12),
			cart: { items: [] },
		});

		await user.save();
		try {
			await MailService.sendMail({
				to: email,
				from: 'shop@node.com',
				subject: 'Regarding Signup',
				html: '<strong>Account successfully Created...</strong>',
			});

			console.log('Email Sent...');
		} catch (err) {
			console.log('Error in sending mail...');
			console.log(err);
		}

		// await new GMailService().sendMail(
		// 	email,
		// 	'Regarding Account Creation',
		// 	'<h1>You successfully signed up!</h1>'
		// );

		res.redirect('/login');
	}
};
