import { Router } from 'express';
// import path from 'path';
// import rootDir from '../utils/rootDir';
const router = Router();

interface Product {
	title: string;
}

const products: Product[] = [];

router.get('/add-product', (req, res, next) => {
	res.render('add-product.pug', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
	});
});

router.post('/add-product', (req, res, next) => {
	products.push({ title: req.body.title });
	res.redirect('/');
});

export default router;
export { products };
