"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewPassword = exports.getNewPassword = exports.postReset = exports.getReset = exports.postSignup = exports.getSignup = exports.postLogout = exports.postLogin = exports.getLoginPage = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = require("bcryptjs");
const getFlashError_1 = require("../utils/getFlashError");
const MailService_1 = require("../utils/MailService");
const crypto_1 = require("crypto");
const express_validator_1 = require("express-validator");
exports.getLoginPage = (req, res, _next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: getFlashError_1.getErrorMessage(req),
        oldInput: {
            email: '',
            password: '',
        },
        validationErrors: [],
    });
};
exports.postLogin = async (req, res, _next) => {
    var _a, _b;
    const email = req.body.email;
    const password = req.body.password;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: 'login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
        });
    }
    const user = await user_1.default.findOne({ email: email });
    if (await bcryptjs_1.compare(password, user.password)) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        (_a = req.session) === null || _a === void 0 ? void 0 : _a.save((_) => res.redirect('/'));
    }
    else {
        req.flash('error', 'Incorrect Password!');
        (_b = req.session) === null || _b === void 0 ? void 0 : _b.save((_) => res.redirect('/login'));
    }
};
exports.postLogout = (req, res, _next) => {
    var _a;
    (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy((err) => {
        console.log('Session cleared...');
        res.redirect('/');
    });
};
exports.getSignup = (req, res, _next) => {
    res.render('auth/signup', {
        path: 'signup',
        pageTitle: 'Signup',
        errorMessage: getFlashError_1.getErrorMessage(req),
        oldInput: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationErrors: [],
    });
};
exports.postSignup = async (req, res, _next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: 'signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword,
            },
            validationErrors: errors.array(),
        });
    }
    const user = new user_1.default({
        email: email,
        password: await bcryptjs_1.hash(password, 12),
        cart: { items: [] },
    });
    await user.save();
    res.redirect('/login');
    try {
        await MailService_1.MailService.sendMail({
            to: email,
            from: 'nodeshop393@gmail.com',
            subject: 'Regarding Signup',
            html: '<strong>Account successfully Created...</strong>',
        });
        console.log('Email Sent...');
    }
    catch (err) {
        console.log('Error in sending mail...');
        console.log(err.response.body);
    }
};
exports.getReset = (req, res, _next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: getFlashError_1.getErrorMessage(req),
    });
};
exports.postReset = (req, res, _next) => {
    crypto_1.randomBytes(32, async (err, buf) => {
        var _a;
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const email = req.body.email;
        const token = buf.toString('hex');
        const user = await user_1.default.findOne({ email: email });
        if (!user) {
            req.flash('error', 'No account with that Email Found.');
            return (_a = req.session) === null || _a === void 0 ? void 0 : _a.save((_) => res.redirect('/reset'));
        }
        ;
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();
        res.redirect('/');
        await MailService_1.MailService.sendMail({
            to: email,
            from: 'nodeshop393@gmail.com',
            subject: 'Password Reset',
            html: `
				<h2> You requested a password Reset</h2>
				<p>Click this  <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>

			`,
        });
        console.log('Reset Password Email Sent...');
    });
};
exports.getNewPassword = async (req, res, _next) => {
    var _a;
    const token = req.params.token;
    const user = await user_1.default.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    });
    if (user) {
        return res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'Update Password',
            errorMessage: getFlashError_1.getErrorMessage(req),
            userId: user === null || user === void 0 ? void 0 : user._id.toString(),
            token: token,
        });
    }
    else {
        req.flash('error', 'Invalid Token...Try again');
        return (_a = req.session) === null || _a === void 0 ? void 0 : _a.save((_) => res.redirect('/reset'));
    }
};
exports.postNewPassword = async (req, res, _next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const token = req.body.token;
    const user = await user_1.default.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId,
    });
    user.password = await bcryptjs_1.hash(password, 12);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await (user === null || user === void 0 ? void 0 : user.save());
    console.log('Password Changed Successfully...');
    res.redirect('/login');
};
//# sourceMappingURL=auth.js.map