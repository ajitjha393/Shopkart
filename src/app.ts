import path from 'path';
import rootDir from './utils/rootDir';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';

import express from 'express';
import bodyParser from 'body-parser';
import expressHbs from 'express-handlebars';
const app = express();

app.engine(
	'hbs',
	expressHbs({
		layoutsDir: 'views/layouts/',
		defaultLayout: 'main-layout',
		extname: 'hbs',
	})
);
app.set('view engine', 'hbs');
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

app.use((req, res, next) => {
	// res.status(404).sendFile(path.join(rootDir, '..', 'views', '404.html'));

	res.status(404).render('404', { pageTitle: '404 Page Not Found' });
});

// Alternative

app.listen(3000);
