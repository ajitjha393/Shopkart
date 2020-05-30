import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import rootDir from './utils/rootDir';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import { get404Page } from './controllers/error';
import { credentials } from './utils/credentials';
import { connect } from 'mongoose';
import User from './models/user';
// import { productSchema } from './models/product';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);

// Serving static files
app.use(express.static(path.join(rootDir, '..', 'public')));

// Custom middleware
app.use(async (req, _res, next) => {
	req.user = await User.findById('5ed0f6410abd5e2f351c84a5');

	// Cookie addition
	//-------
	req.isLoggedIn =
		req
			.get('Cookie')
			?.split(';')
			.find(ck => ck.includes('loggedIn'))
			?.split('=')[1] == 'true';

	next();
});

// use is for all actions and acts as prefix
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 Error
app.use(get404Page);

(async () => {
	try {
		await connect(credentials);
		console.clear();
		// This always return first user
		if (!(await User.findOne())) {
			const user = new User({
				name: 'Bisu Baby',
				email: 'ajitjha393@gmail.com',
				cart: {
					items: [],
				},
			});
			await user.save();
		}
		console.log('Connected.............');

		app.listen(3000);
	} catch (err) {
		console.log('Error while connecting to DB');
	}
})();

// For killing port
// kill -9 $(lsof -t -i tcp:3000)
