import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import rootDir from './utils/rootDir'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import authRoutes from './routes/auth'
import { get404Page, get500Page } from './controllers/error'
import { credentials } from './utils/credentials'
import { connect } from 'mongoose'
import User from './models/user'
import session from 'express-session'
import cms from 'connect-mongodb-session'
import csrf from 'csurf'
import flash from 'connect-flash'
import multer from 'multer'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import fs from 'fs'
// import https from 'https'

const app = express()

const MongoDBStore = cms(session)
const store = new MongoDBStore({
	uri: credentials,
	collection: 'sessions',
})

const csrfProtection = csrf()
app.set('view engine', 'ejs')
app.set('views', 'views')

// const privateKey = fs.readFileSync(path.join(rootDir, '..', 'server.key'))
// const certificate = fs.readFileSync(path.join(rootDir, '..', 'server.cert'))

const fileStorage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, 'images')
	},

	filename: (_req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname)
	},
})

const accessLogStream = fs.createWriteStream(
	path.join(rootDir, '..', 'access.log'),
	{
		flags: 'a',
	}
)

app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
)

app.use(
	multer({
		storage: fileStorage,
		fileFilter: (_req, file, cb) => {
			if (
				file.mimetype === 'image/png' ||
				file.mimetype === 'image/jpg' ||
				file.mimetype === 'image/jpeg'
			) {
				return cb(null, true)
			}
			cb(null, false)
		},
	}).single('image')
)

// Serving static files
app.use(express.static(path.join(rootDir, '..', 'public')))
app.use('/images', express.static(path.join(rootDir, '..', 'images')))

// Custom middleware

app.use(
	session({
		secret: 'my secret hash text',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
)

app.use(async (req, _res, next) => {
	try {
		if (req.session!.user) {
			req.user = await User.findById(req.session!.user._id)
		}
	} catch (err) {
		throw new Error(err)
	}

	next()
})

app.use(csrfProtection)
app.use(flash())
// use is for all actions and acts as prefix

// Passing local variables to the views
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session!.isLoggedIn

	res.locals.csrfToken = req.csrfToken()
	next()
})
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

//500  error
app.use('/500', get500Page)

// 404 Error
app.use(get404Page)

// Express Error Middleware - Skips all other remaining middlewares
app.use(
	(
		_error: Error,
		_req: any,
		res: { redirect: (arg0: string) => void },
		_next: any
	) => {
		return res.redirect('/500')
	}
)
;(async () => {
	try {
		await connect(credentials)
		console.clear()

		app.listen(process.env.PORT || 3000)
		console.log('Connected.............')
	} catch (err) {
		console.log('Error while connecting to DB')
	}
})()
