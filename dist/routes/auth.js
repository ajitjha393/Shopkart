"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const router = express_1.Router();
router.get('/login', auth_1.getLoginPage);
router.post('/login', [
    express_validator_1.body('email')
        .isEmail()
        .withMessage('Please Enter A Valid Email')
        .custom(async (value) => {
        const user = await user_1.default.findOne({ email: value });
        if (!user) {
            throw new Error('Email Id does not exists...');
        }
        return true;
    })
        .normalizeEmail(),
    express_validator_1.body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be of atleast 5 characters ')
        .isAlphanumeric()
        .withMessage('Password must contain only Alphanumeric Character ')
        .trim(),
], auth_1.postLogin);
router.get('/signup', auth_1.getSignup);
router.post('/signup', [
    express_validator_1.body('email')
        .isEmail()
        .withMessage('Please Enter A Valid Email ')
        .custom(async (value) => {
        const user = await user_1.default.findOne({ email: value });
        if (user) {
            throw new Error('Email already exists, please pick a different one');
        }
        return true;
    })
        .normalizeEmail(),
    express_validator_1.body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be of atleast 5 characters ')
        .isAlphanumeric()
        .withMessage('Password must contain only Alphanumeric Character ')
        .trim(),
    express_validator_1.body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords Do not Match...');
        }
        return true;
    }),
], auth_1.postSignup);
router.post('/logout', auth_1.postLogout);
router.get('/reset', auth_1.getReset);
router.post('/reset', auth_1.postReset);
router.get('/reset/:token', auth_1.getNewPassword);
router.post('/new-password', auth_1.postNewPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map