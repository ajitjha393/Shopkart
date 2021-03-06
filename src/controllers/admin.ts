import { RequestHandler } from 'express'
import Product from '../models/product'
import { validationResult } from 'express-validator'
import { deleteFile } from '../utils/fileUtility'

export const getAddProduct: RequestHandler = (req, res, _next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
		// isAuthenticated: req.session!.isLoggedIn,
	})
}

export const postAddProduct: RequestHandler = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty() || !req.file) {
			return res.status(422).render('admin/edit-product', {
				pageTitle: 'Add Product',
				path: '/admin/edit-product',
				editing: false,
				hasError: true,
				product: {
					title: req.body.title,
					description: req.body.description,
					price: +req.body.price,
					userId: req.user,
				},
				errorMessage: req.file
					? errors.array()[0].msg
					: 'Attached File is not an image',
				validationErrors: req.file ? errors.array() : [],
				// isAuthenticated: req.session!.isLoggedIn,
			})
		}

		const product = new Product({
			title: req.body.title,
			description: req.body.description,
			price: +req.body.price,
			imageUrl: req.file.path, //This stores the path on our file system
			userId: req.user,
		})

		await product.save()
		console.log('Product Created....')
	} catch (err) {
		// Good way
		// console.log(err)
		// return res.redirect('/500')

		// Better way Using error middleware
		//  new Error(err)
		return next(new Error(err))
	}
	res.redirect('/')
}

export const getEditProduct: RequestHandler = async (req, res, _next) => {
	const editMode = req.query.edit

	if (!editMode) {
		return res.redirect('/')
	}

	const prodId = req.params.productId
	const product = await Product.findById(prodId)
	console.log('Edit Mode')
	if (!product) {
		return res.redirect('/404')
	}

	res.render('admin/edit-product', {
		pageTitle: 'Edit Product',
		path: '/admin/edit-product',
		editing: editMode,
		product,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
		// isAuthenticated: req.session!.isLoggedIn,
	})
}

export const postEditProduct: RequestHandler = async (req, res, _next) => {
	const updatedProduct = {
		title: req.body.title,
		description: req.body.description,
		price: +req.body.price,
		userId: req.user._id,
	}

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title: req.body.title,
				description: req.body.description,
				price: +req.body.price,
				_id: req.body.productId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
			// isAuthenticated: req.session!.isLoggedIn,
		})
	}

	const product: any = await Product.findById(req.body.productId)
	if (product.userId.toString() !== req.user._id.toString()) {
		console.log('You do not have authorization to edit this product...')
		return res.redirect('/')
	} else {
		if (req.file) {
			deleteFile(product.imageUrl)
			product.imageUrl = req.file.path
		}
		;(product.title = updatedProduct.title),
			(product.description = updatedProduct.description),
			(product.price = updatedProduct.price),
			req.file ? (product.imageUrl = req.file.path) : null,
			await product.save()

		console.log('Product Updated ....')

		res.redirect('/admin/products')
	}
	// await Product.replaceOne(
	// 	{ _id: new ObjectId(req.body.productId) },
	// 	updatedProduct
	// );
}

export const getProducts: RequestHandler = async (req, res, _next) => {
	const products = await Product.find({ userId: req.user._id })

	res.render('admin/products', {
		products,
		path: '/admin/products',
		pageTitle: 'Admin Products',
	})
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
	try {
		const prodId = req.params.productId
		const productDoc = await Product.findById(prodId)
		if (!productDoc) {
			return next(new Error('Product not Found.'))
		}
		deleteFile((productDoc as any).imageUrl)

		await Product.deleteOne({ _id: prodId, userId: req.user._id })
		console.log('Product Deleted ....')
		// res.redirect('/admin/products')
		res.status(200).json({ message: 'Success!' })
	} catch (err) {
		res.status(500).json({ message: 'Deleting Product Failed!' })
	}
}
