"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get500Page = exports.get404Page = void 0;
// Page Not Found
exports.get404Page = (req, res, _next) => {
    res.status(404).render('404', {
        pageTitle: '404 Page Not Found',
        path: null,
        isAuthenticated: req.isLoggedIn,
    });
};
// Server Side error
exports.get500Page = (req, res, _next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: null,
        isAuthenticated: req.isLoggedIn,
    });
};
//# sourceMappingURL=error.js.map