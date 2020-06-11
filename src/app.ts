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
const app = express()

const MongoDBStore = cms(session)
const store = new MongoDBStore({
	uri: credentials,
	collection: 'sessions',
})

const csrfProtection = csrf()
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
)

// Serving static files
app.use(express.static(path.join(rootDir, '..', 'public')))

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
;(async () => {
	try {
		await connect(credentials)
		console.clear()

		app.listen(3000)
		console.log('Connected.............')
	} catch (err) {
		console.log('Error while connecting to DB')
	}
})()
