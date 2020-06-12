import { RequestHandler } from 'express'
import Product from '../models/product'
import Order from '../models/order'
import rootDir from '../utils/rootDir'
import path from 'path'
import fs from 'fs'
export const getIndexPage: RequestHandler = async (req, res, _next) => {
	const products = await Product.find()
	console.log('Products Fetched....')
	res.render('shop/index', {
		products,
		path: '/',
		pageTitle: 'Shop',
	})
}

export const getProducts: RequestHandler = async (req, res, _next) => {
	const products = await Product.find()
	res.render('shop/product-list', {
		products,
		path: '/products',
		pageTitle: 'All Products',
		// isAuthenticated: req.session!.isLoggedIn,
	})
}

export const getProductDetails: RequestHandler = async (req, res, _next) => {
	const prodId = req.params.productId
	const product = await Product.findById(prodId)
	console.log('Single Product Fetched...')
	console.log(product)
	if (!product) {
		res.redirect('/')
	} else {
		res.render('shop/product-detail', {
			product,
			path: '/products',
			pageTitle: (product as any).title,
			// isAuthenticated: req.session!.isLoggedIn,
		})
	}
}

export const getCart: RequestHandler = async (req, res, _next) => {
	const user = await req.user.populate('cart.items.productId').execPopulate()
	const cartProducts = user.cart.items

	res.render('shop/cart', {
		products: cartProducts,
		path: '/cart',
		pageTitle: 'Your Cart',
		// isAuthenticated: req.session!.isLoggedIn,
	})
}

export const postCart: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId
	const product = await Product.findById(prodId)

	if (product) {
		await req.user.addToCart(product)
	}
	console.log('Added To Cart....')
	res.redirect('/cart')
}

export const deleteCartProduct: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId
	await req.user.deleteFromCart(prodId)
	console.log('Deleted From Cart....')
	res.redirect('/cart')
}

export const getOrders: RequestHandler = async (req, res, _next) => {
	const orders = await Order.find({ 'user.userId': req.user._id })

	res.render('shop/orders', {
		orders,
		path: '/orders',
		pageTitle: 'Your Orders',
		// isAuthenticated: req.session!.isLoggedIn,
	})
}

export const postOrder: RequestHandler = async (req, res, _next) => {
	const user = await req.user.populate('cart.items.productId').execPopulate()
	const cartProducts = user.cart.items.map((i: any) => ({
		quantity: i.quantity,
		product: { ...i.productId._doc },
	}))

	const order = new Order({
		user: {
			email: req.user.email,
			userId: req.user._id,
		},

		products: cartProducts,
	})

	await order.save()
	await req.user.clearCart()
	res.redirect('/orders')
}

export const getInvoice: RequestHandler = (req, res, next) => {
	const orderId = req.params.orderId
	const invoiceName = 'invoice-' + orderId + '.pdf'
	const invoicePath = path.join(
		rootDir,
		'..',
		'data',
		'invoices',
		invoiceName
	)
	fs.readFile(invoicePath, (err, data) => {
		if (err) {
			return next(err)
		}
		res.send(data)
	})
}

// // export const getCheckoutPage: RequestHandler = async (_req, res, _next) => {
// // 	const products = await Product.findAll();
// // 	res.render('shop/index', {
// // 		products,
// // 		path: '/checkout',
// // 		pageTitle: 'Checkout',
// // 	});
// // };
