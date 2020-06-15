"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const rootDir_1 = __importDefault(require("./utils/rootDir"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_1 = require("./controllers/error");
const credentials_1 = require("./utils/credentials");
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("./models/user"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const multer_1 = __importDefault(require("multer"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
// import https from 'https'
const app = express_1.default();
const MongoDBStore = connect_mongodb_session_1.default(express_session_1.default);
const store = new MongoDBStore({
    uri: credentials_1.credentials,
    collection: 'sessions',
});
const csrfProtection = csurf_1.default();
app.set('view engine', 'ejs');
app.set('views', 'views');
// const privateKey = fs.readFileSync(path.join(rootDir, '..', 'server.key'))
// const certificate = fs.readFileSync(path.join(rootDir, '..', 'server.cert'))
const fileStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'images');
    },
    filename: (_req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(rootDir_1.default, '..', 'access.log'), {
    flags: 'a',
});
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(morgan_1.default('combined', { stream: accessLogStream }));
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
app.use(multer_1.default({
    storage: fileStorage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            return cb(null, true);
        }
        cb(null, false);
    },
}).single('image'));
// Serving static files
app.use(express_1.default.static(path_1.default.join(rootDir_1.default, '..', 'public')));
app.use('/images', express_1.default.static(path_1.default.join(rootDir_1.default, '..', 'images')));
// Custom middleware
app.use(express_session_1.default({
    secret: 'my secret hash text',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(async (req, _res, next) => {
    try {
        if (req.session.user) {
            req.user = await user_1.default.findById(req.session.user._id);
        }
    }
    catch (err) {
        throw new Error(err);
    }
    next();
});
app.use(csrfProtection);
app.use(connect_flash_1.default());
// use is for all actions and acts as prefix
// Passing local variables to the views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use('/admin', admin_1.default);
app.use(shop_1.default);
app.use(auth_1.default);
//500  error
app.use('/500', error_1.get500Page);
// 404 Error
app.use(error_1.get404Page);
// Express Error Middleware - Skips all other remaining middlewares
app.use((_error, _req, res, _next) => {
    return res.redirect('/500');
});
(async () => {
    try {
        await mongoose_1.connect(credentials_1.credentials);
        console.clear();
        app.listen(process.env.PORT || 3000);
        console.log('Connected.............');
    }
    catch (err) {
        console.log('Error while connecting to DB');
    }
})();
//# sourceMappingURL=app.js.map