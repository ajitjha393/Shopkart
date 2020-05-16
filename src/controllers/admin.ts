import { RequestHandler } from 'express';
import { Product } from '../models/product';

export const getAddProduct: RequestHandler = (_req, res, _next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

export const postAddProduct: RequestHandler = async (req, res, _next) => {
	const product = new Product(
		'',
		req.body.title,
		req.body.imageUrl,
		req.body.description,
		req.body.price
	);
	await product.save();
	res.redirect('/');
};

export const getEditProduct: RequestHandler = async (req, res, _next) => {
	const editMode = req.query.edit;

	if (!editMode) {
		return res.redirect('/');
	}

	const prodId = req.params.productId;
	const product = await Product.getProductById(prodId);

	if (!product) {
		return res.redirect('/404');
	}

	res.render('admin/edit-product', {
		pageTitle: 'Edit Product',
		path: '/admin/edit-product',
		editing: editMode,
		product,
	});
};

export const postEditProduct: RequestHandler = async (req, res, _next) => {
	const newProduct = new Product(
		req.body.productId,
		req.body.title,
		req.body.imageUrl,
		req.body.description,
		req.body.price
	);
	await newProduct.save();

	res.redirect('/admin/products');
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
	const products = await Product.fetchAll();
	res.render('admin/products', {
		products,
		path: '/admin/products',
		pageTitle: 'Admin Products',
	});
};

export const deleteProduct: RequestHandler = async (req, res, _next) => {
	const prodId = req.body.productId;

	await Product.deleteProduct(prodId);

	res.redirect('/admin/products');
};
