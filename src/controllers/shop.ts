import { RequestHandler } from 'express';
import { Product } from '../models/product';
import { Cart } from '../models/cart';

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

export const getProductDetails: RequestHandler = async (req, res, _next) => {
	const prodId = req.params.productId;
	const product = await Product.getProductById(prodId);
	if (!product) {
		res.redirect('/');
	} else {
		res.render('shop/product-detail', {
			product,
			path: '/products',
			pageTitle: product.title,
		});
	}
};

export const getCart: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop/cart', {
		products,
		path: '/cart',
		pageTitle: 'Your Cart',
	});
};

export const postCart: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;
	const product = await Product.getProductById(prodId);
	Cart.addProduct(prodId, product!.price);
	res.redirect('/cart');
};

export const getOrders: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('shop/orders', {
		products,
		path: '/orders',
		pageTitle: 'Your Orders',
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
