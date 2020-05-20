import { RequestHandler } from 'express';
import { Product } from '../models/product';
// import { Order } from '../models/order';

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

export const getCart: RequestHandler = async (req, res, _next) => {
	const cart = await req.user.getCart();
	console.log(cart);
	const cartProducts = await cart.getProducts();

	res.render('shop/cart', {
		products: cartProducts,
		path: '/cart',
		pageTitle: 'Your Cart',
	});
};

export const postCart: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;
	const cart = await req.user.getCart();
	let [product] = await cart.getProducts({
		where: { id: prodId },
	});

	let newQuantity = 1;
	if (product) {
		// If the product exist in the cart
		const oldQuantity = product.cartItem.quantity;
		newQuantity = oldQuantity + 1;
	} else {
		product = await Product.findByPk(prodId);
		// await cart.addProduct(productToBeAdded);
	}

	await cart.addProduct(product, {
		through: {
			quantity: newQuantity,
		},
	});
	res.redirect('/cart');
};

export const deleteCartProduct: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;
	const cart = await req.user.getCart();
	let [product] = await cart.getProducts({
		where: { id: prodId },
	});

	await product.cartItem.destroy();
	res.redirect('/cart');
};

export const getOrders: RequestHandler = async (req, res, _next) => {
	const orders = await req.user.getOrders({ include: ['products'] });

	console.log(orders);

	res.render('shop/orders', {
		orders,
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

export const postOrder: RequestHandler = async (req, res, _next) => {
	const cart = await req.user.getCart();
	const products = (await cart.getProducts()) as any[];

	const order = await req.user.createOrder();

	await order.addProducts(
		products.map(product => {
			product.orderItem = {
				quantity: product.cartItem.quantity,
			};
			return product;
		})
	);

	await cart.setProducts(null);

	res.redirect('/orders');
};

export const getCheckoutPage: RequestHandler = async (_req, res, _next) => {
	const products = await Product.findAll();
	res.render('shop/index', {
		products,
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
