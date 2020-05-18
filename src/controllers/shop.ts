import { RequestHandler } from 'express';
import { Product } from '../models/product';
import { Cart } from '../models/cart';

interface ProductType {
	id: number;
	title: string;
	price: number;
	description: string;
	imageUrl: string;
}

export const getIndexPage: RequestHandler = async (_req, res, _next) => {
	const products = await Product.findAll();

	res.render('shop/index', {
		products,
		path: '/',
		pageTitle: 'Shop',
	});
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
	const products = await Product.findAll();
	res.render('shop/product-list', {
		products,
		path: '/products',
		pageTitle: 'All Products',
	});
};

export const getProductDetails: RequestHandler = async (req, res, _next) => {
	const prodId = req.params.productId;
	const product = await Product.findByPk(prodId);
	console.log(product);
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
	const cart = await Cart.retrieveCartProducts();
	const products = await Product.findAll();
	console.log(products, '----------');
	const cartProducts = [];

	for (const product of cart.products) {
		const prd = products.find(prod => +prod.id === +product.id);

		cartProducts.push({ productData: prd, qty: product.qty });
	}

	console.log(cartProducts);

	res.render('shop/cart', {
		products: cartProducts,
		path: '/cart',
		pageTitle: 'Your Cart',
	});
};

export const postCart: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;
	const product = await Product.findByPk(prodId);
	await Cart.addProduct(prodId, product!.price);
	res.redirect('/cart');
};

export const deleteCartProduct: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;
	const reqProduct = await Product.findByPk(prodId);
	await Cart.deleteProductFromCart(prodId, reqProduct!.price);
	res.redirect('/cart');
};

export const getOrders: RequestHandler = async (_req, res, _next) => {
	const products = await Product.findAll();
	res.render('shop/orders', {
		products,
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

export const getCheckoutPage: RequestHandler = async (_req, res, _next) => {
	const products = await Product.findAll();
	res.render('shop/index', {
		products,
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
