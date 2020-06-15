import { RequestHandler } from 'express'
import Product from '../models/product'
import Order from '../models/order'
import rootDir from '../utils/rootDir'
import path from 'path'
import fs from 'fs'
import PDFDocument from 'pdfkit'
import { STRIPE_SECRET_KEY } from '../utils/credentials'
import stripeFn from 'stripe'

const stripe = new stripeFn(STRIPE_SECRET_KEY, {
	apiVersion: '2020-03-02',
})

const ITEMS_PER_PAGE = 4
export const getIndexPage: RequestHandler = async (req, res, _next) => {
	const page = +req.query.page || 1

	const totalItems = await Product.find().countDocuments()

	const products = await Product.find()
		.skip((page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE)

	console.log('Products Fetched....')
	res.render('shop/index', {
		products,
		path: '/',
		pageTitle: 'Shop',
		currentPage: page,
		hasNextPage: ITEMS_PER_PAGE * page < totalItems,
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1,
		lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
	})
}

export const getProducts: RequestHandler = async (req, res, _next) => {
	const page = +req.query.page || 1

	const totalItems = await Product.find().countDocuments()

	const products = await Product.find()
		.skip((page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE)

	res.render('shop/product-list', {
		products,
		path: '/products',
		pageTitle: 'All Products',
		currentPage: page,
		hasNextPage: ITEMS_PER_PAGE * page < totalItems,
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1,
		lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

export const getInvoice: RequestHandler = async (req, res, next) => {
	try {
		const orderId = req.params.orderId
		const orderDoc = await Order.findById(orderId)
		if (!orderDoc) {
			return next(new Error('Order Not Found...'))
		}
		if (
			(orderDoc as any).user.userId.toString() !== req.user._id.toString()
		) {
			return next(new Error('You r unauthorized...'))
		}
		const invoiceName = 'invoice-' + orderId + '.pdf'
		const invoicePath = path.join(
			rootDir,
			'..',
			'data',
			'invoices',
			invoiceName
		)

		res.setHeader('Content-Type', 'application/pdf')
		res.setHeader(
			'Content-Disposition',
			`inline; filename="${invoiceName}"`
		)
		const pdfDoc = new PDFDocument()
		pdfDoc.pipe(fs.createWriteStream(invoicePath))
		pdfDoc.pipe(res)

		pdfDoc.fontSize(26).text('Invoice', {
			underline: true,
		})

		pdfDoc.text('\n')

		// pdfDoc.text('---------------------------------')
		let totalPrice = 0
		;(orderDoc as any).products.forEach((prod: any) => {
			pdfDoc
				.fontSize(14)
				.text(
					`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
				)

			totalPrice += prod.quantity * prod.product.price
		})
		pdfDoc.text('----------------------------------------')
		pdfDoc.text('\n')

		pdfDoc.fontSize(20).text('Total Price: $' + totalPrice)

		pdfDoc.end()
	} catch (err) {
		return next(err)
	}
}

export const getCheckoutPage: RequestHandler = async (req, res, _next) => {
	try {
		const user = await req.user
			.populate('cart.items.productId')
			.execPopulate()
		const cartProducts = user.cart.items

		let total = 0
		cartProducts.forEach((p: any) => {
			total += p.quantity * p.productId.price
		})

		const stripeSession = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: cartProducts.map((p: any) => {
				return {
					name: p.productId.title,
					description: p.productId.description,
					amount: p.productId.price * 100,
					currency: 'usd',
					quantity: p.quantity,
				}
			}),
			success_url: `${req.protocol}://${req.get(
				'host'
			)}/checkout/success`,
			cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
		})

		res.render('shop/checkout', {
			products: cartProducts,
			path: '/checkout',
			pageTitle: 'Checkout',
			totalSum: total,
			sessionId: stripeSession.id,
		})
	} catch (err) {
		console.log(err)
	}
}

export const getCheckoutSuccess: RequestHandler = async (req, res, _next) => {
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
