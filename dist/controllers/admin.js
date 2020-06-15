"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProducts = exports.postEditProduct = exports.getEditProduct = exports.postAddProduct = exports.getAddProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const express_validator_1 = require("express-validator");
const fileUtility_1 = require("../utils/fileUtility");
exports.getAddProduct = (req, res, _next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};
exports.postAddProduct = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
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
            });
        }
        const product = new product_1.default({
            title: req.body.title,
            description: req.body.description,
            price: +req.body.price,
            imageUrl: req.file.path,
            userId: req.user,
        });
        await product.save();
        console.log('Product Created....');
    }
    catch (err) {
        // Good way
        // console.log(err)
        // return res.redirect('/500')
        // Better way Using error middleware
        //  new Error(err)
        return next(new Error(err));
    }
    res.redirect('/');
};
exports.getEditProduct = async (req, res, _next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    const product = await product_1.default.findById(prodId);
    console.log('Edit Mode');
    if (!product) {
        return res.redirect('/404');
    }
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};
exports.postEditProduct = async (req, res, _next) => {
    const updatedProduct = {
        title: req.body.title,
        description: req.body.description,
        price: +req.body.price,
        userId: req.user._id,
    };
    const errors = express_validator_1.validationResult(req);
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
        });
    }
    const product = await product_1.default.findById(req.body.productId);
    if (product.userId.toString() !== req.user._id.toString()) {
        console.log('You do not have authorization to edit this product...');
        return res.redirect('/');
    }
    else {
        if (req.file) {
            fileUtility_1.deleteFile(product.imageUrl);
            product.imageUrl = req.file.path;
        }
        ;
        (product.title = updatedProduct.title),
            (product.description = updatedProduct.description),
            (product.price = updatedProduct.price),
            req.file ? (product.imageUrl = req.file.path) : null,
            await product.save();
        console.log('Product Updated ....');
        res.redirect('/admin/products');
    }
    // await Product.replaceOne(
    // 	{ _id: new ObjectId(req.body.productId) },
    // 	updatedProduct
    // );
};
exports.getProducts = async (req, res, _next) => {
    const products = await product_1.default.find({ userId: req.user._id });
    res.render('admin/products', {
        products,
        path: '/admin/products',
        pageTitle: 'Admin Products',
    });
};
exports.deleteProduct = async (req, res, next) => {
    try {
        const prodId = req.params.productId;
        const productDoc = await product_1.default.findById(prodId);
        if (!productDoc) {
            return next(new Error('Product not Found.'));
        }
        fileUtility_1.deleteFile(productDoc.imageUrl);
        await product_1.default.deleteOne({ _id: prodId, userId: req.user._id });
        console.log('Product Deleted ....');
        // res.redirect('/admin/products')
        res.status(200).json({ message: 'Success!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Deleting Product Failed!' });
    }
};
//# sourceMappingURL=admin.js.map