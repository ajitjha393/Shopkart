import { RequestHandler } from 'express';
import { Product } from '../models/product';

export const getAddProduct: RequestHandler = (req, res, _next) => {
	res.render('add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		formCSS: true,
		productCSS: true,
		activeAddProduct: true,
	});
};

export const postAddProduct: RequestHandler = async (req, res, _next) => {
	const product = new Product(req.body.title);
	await product.save();
	res.redirect('/');
};

export const getProducts: RequestHandler = async (req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop', {
		products,
		path: '/',
		pageTitle: 'Shop',
		productCSS: true,
		activeShop: true,
	});
};
