import { RequestHandler } from 'express';
import Product from '../models/product';
import { ObjectId } from 'mongodb';

export const getAddProduct: RequestHandler = (req, res, _next) => {
	if (!req.session!.user) {
		console.log('Please Login...');
		return res.redirect('/login');
	}

	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session!.isLoggedIn,
	});
};

export const postAddProduct: RequestHandler = async (req, res, _next) => {
	try {
		const product = new Product({
			title: req.body.title,
			description: req.body.description,
			price: +req.body.price,
			imageUrl: req.body.imageUrl,
			userId: req.user,
		});

		await product.save();
		console.log('Product Created....');
	} catch (err) {
		console.log(err);
	}
	res.redirect('/');
};

export const getEditProduct: RequestHandler = async (req, res, _next) => {
	const editMode = req.query.edit;

	if (!editMode) {
		return res.redirect('/');
	}

	const prodId = req.params.productId;
	const product = await Product.findById(prodId);
	console.log('Edit Mode');
	if (!product) {
		return res.redirect('/404');
	}

	res.render('admin/edit-product', {
		pageTitle: 'Edit Product',
		path: '/admin/edit-product',
		editing: editMode,
		product,
		isAuthenticated: req.session!.isLoggedIn,
	});
};

export const postEditProduct: RequestHandler = async (req, res, _next) => {
	const updatedProduct = {
		title: req.body.title,
		description: req.body.description,
		price: +req.body.price,
		imageUrl: req.body.imageUrl,
		userId: req.user._id,
	};

	await Product.replaceOne(
		{ _id: new ObjectId(req.body.productId) },
		updatedProduct
	);

	console.log('Product Updated ....');

	res.redirect('/admin/products');
};

export const getProducts: RequestHandler = async (req, res, _next) => {
	const products = await Product.find();

	res.render('admin/products', {
		products,
		path: '/admin/products',
		pageTitle: 'Admin Products',
		isAuthenticated: req.session!.isLoggedIn,
	});
};

export const deleteProduct: RequestHandler = async (req, res, _next) => {
	const prodId = new ObjectId(req.body.productId);

	await Product.deleteOne({ _id: prodId });
	console.log('Product Deleted ....');
	res.redirect('/admin/products');
};
