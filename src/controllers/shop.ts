import { RequestHandler } from 'express';
import Product from '../models/product';
// // import { Order } from '../models/order';

export const getIndexPage: RequestHandler = async (_req, res, _next) => {
	const products = await Product.find();
	// Can also add diff filtering
	// const products = await Product.find().select('title imageUrl').populate('userId);
	console.log('Products Fetched....');
	res.render('shop/index', {
		products,
		path: '/',
		pageTitle: 'Shop',
	});
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
	const products = await Product.find();
	res.render('shop/product-list', {
		products,
		path: '/products',
		pageTitle: 'All Products',
	});
};

export const getProductDetails: RequestHandler = async (req, res, _next) => {
	const prodId = req.params.productId;
	const product = await Product.findById(prodId);
	console.log('Single Product Fetched...');
	console.log(product);
	if (!product) {
		res.redirect('/');
	} else {
		res.render('shop/product-detail', {
			product,
			path: '/products',
			pageTitle: (product as any).title,
		});
	}
};

// export const getCart: RequestHandler = async (req, res, _next) => {
// 	const cartProducts = await req.user.getCart();

// 	res.render('shop/cart', {
// 		products: cartProducts,
// 		path: '/cart',
// 		pageTitle: 'Your Cart',
// 	});
// };

export const postCart: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;
	const product = await Product.findById(prodId);

	if (product) {
		await req.user.addToCart(product);
	}
	console.log('Added To Cart....');
	res.redirect('/cart');
};

// export const deleteCartProduct: RequestHandler = async (req, res, _next) => {
// 	const prodId = req.body.productId;
// 	await req.user.deleteFromCart(prodId, req.user._id);
// 	console.log('Deleted From Cart....');
// 	res.redirect('/cart');
// };

// export const getOrders: RequestHandler = async (req, res, _next) => {
// 	const orders = await req.user.getOrders(req.user._id);

// 	res.render('shop/orders', {
// 		orders,
// 		path: '/orders',
// 		pageTitle: 'Your Orders',
// 	});
// };

// export const postOrder: RequestHandler = async (req, res, _next) => {
// 	await req.user.addOrder(req.user._id);
// 	res.redirect('/orders');
// };

// // export const getCheckoutPage: RequestHandler = async (_req, res, _next) => {
// // 	const products = await Product.findAll();
// // 	res.render('shop/index', {
// // 		products,
// // 		path: '/checkout',
// // 		pageTitle: 'Checkout',
// // 	});
// // };
