"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
exports.isAuth = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log('Please Login...');
        return res.redirect('/login');
    }
    next();
};
//# sourceMappingURL=isAuth.js.map