import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import rootDir from './utils/rootDir';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404Page } from './controllers/error';
import { promisify } from 'util';
import { ProductInterface } from './models/product';
import { executeQuery } from './utils/database';
// import { QueryOptions } from 'mysql2';

// import db from './utils/database';

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

// use is for all actions and acts as prefix
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error
app.use(get404Page);

app.listen(3000);
