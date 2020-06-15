"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_SECRET_KEY = exports.API_KEY = exports.credentials = void 0;
exports.credentials = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-myhv8.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
exports.API_KEY = process.env.SENDGRID_API_KEY;
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
//# sourceMappingURL=credentials.js.map