import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import rootDir from './utils/rootDir';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404Page } from './controllers/error';
import { credentials } from './utils/credentials';
import { connect } from 'mongoose';
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
	next();
});

// use is for all actions and acts as prefix
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error
app.use(get404Page);

(async () => {
	await connect(credentials);
	console.clear();
	console.log('Connected.............');
	app.listen(3000);
})();
