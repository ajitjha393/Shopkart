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
	try {
		(req as any).user.createProduct({
			title: req.body.title,
			price: req.body.price,
			imageUrl: req.body.imageUrl,
			description: req.body.description,
		});

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

	const prodId = +req.params.productId;
	// const product = await Product.findByPk(prodId);

	const [product] = await (<any>req).user.getProducts({
		where: { id: prodId },
	});

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
	const updatedProduct = {
		title: req.body.title,
		imageUrl: req.body.imageUrl,
		description: req.body.description,
		price: +req.body.price,
	};
	await Product.update(updatedProduct, {
		where: {
			id: +req.body.productId,
		},
	});

	res.redirect('/admin/products');
};

export const getProducts: RequestHandler = async (req, res, _next) => {
	const products = await (<any>req).user.getProducts();
	res.render('admin/products', {
		products,
		path: '/admin/products',
		pageTitle: 'Admin Products',
	});
};

export const deleteProduct: RequestHandler = async (req, res, _next) => {
	const prodId = +req.body.productId;

	await Product.destroy({
		where: {
			id: prodId,
		},
	});
	res.redirect('/admin/products');
};
