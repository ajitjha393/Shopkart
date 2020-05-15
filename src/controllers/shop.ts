import { RequestHandler } from 'express';
import { Product } from '../models/product';

export const getIndexPage: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop/index', {
		products,
		path: '/',
		pageTitle: 'Shop',
	});
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop/product-list', {
		products,
		path: '/products',
		pageTitle: 'All Products',
	});
};

export const getCart: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop/cart', {
		products,
		path: '/cart',
		pageTitle: 'Your Cart',
	});
};

export const getCheckoutPage: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop/index', {
		products,
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
