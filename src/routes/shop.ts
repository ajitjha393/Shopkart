// import path from 'path';
// import rootDir from '../utils/rootDir';
import { Router } from 'express';
import { products } from './admin';

// It acts like mini express App
const router = Router();

router.get('/', (_req, res, _next) => {
	console.log('[Shop]', products);
	// res.sendFile(path.join(rootDir, '..', 'views', 'shop.html'));

	res.render('shop', {
		products,
		path: '/',
		pageTitle: 'Shop',
		productCSS: true,
		activeShop: true,
	});
});

export default router;
