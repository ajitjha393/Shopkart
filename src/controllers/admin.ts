import { RequestHandler } from 'express';
import { Product } from '../models/product';

export const getAddProduct: RequestHandler = (_req, res, _next) => {
	res.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		formCSS: true,
		productCSS: true,
		activeAddProduct: true,
	});
};

export const postAddProduct: RequestHandler = async (req, res, _next) => {
	const product = new Product(
		req.body.title,
		req.body.imageUrl,
		req.body.description,
		req.body.price
	);
	await product.save();
	res.redirect('/');
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('admin/products', {
		products,
		path: '/admin/products',
		pageTitle: 'Admin Products',
	});
};
