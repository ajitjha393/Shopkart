"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckoutSuccess = exports.getCheckoutPage = exports.getInvoice = exports.postOrder = exports.getOrders = exports.deleteCartProduct = exports.postCart = exports.getCart = exports.getProductDetails = exports.getProducts = exports.getIndexPage = void 0;
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const rootDir_1 = __importDefault(require("../utils/rootDir"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const credentials_1 = require("../utils/credentials");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(credentials_1.STRIPE_SECRET_KEY, {
    apiVersion: '2020-03-02',
});
const ITEMS_PER_PAGE = 4;
exports.getIndexPage = async (req, res, _next) => {
    const page = +req.query.page || 1;
    const totalItems = await product_1.default.find().countDocuments();
    const products = await product_1.default.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    console.log('Products Fetched....');
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
    });
};
exports.getProducts = async (req, res, _next) => {
    const page = +req.query.page || 1;
    const totalItems = await product_1.default.find().countDocuments();
    const products = await product_1.default.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
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
    });
};
exports.getProductDetails = async (req, res, _next) => {
    const prodId = req.params.productId;
    const product = await product_1.default.findById(prodId);
    console.log('Single Product Fetched...');
    console.log(product);
    if (!product) {
        res.redirect('/');
    }
    else {
        res.render('shop/product-detail', {
            product,
            path: '/products',
            pageTitle: product.title,
        });
    }
};
exports.getCart = async (req, res, _next) => {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    const cartProducts = user.cart.items;
    res.render('shop/cart', {
        products: cartProducts,
        path: '/cart',
        pageTitle: 'Your Cart',
    });
};
exports.postCart = async (req, res, _next) => {
    const prodId = req.body.productId;
    const product = await product_1.default.findById(prodId);
    if (product) {
        await req.user.addToCart(product);
    }
    console.log('Added To Cart....');
    res.redirect('/cart');
};
exports.deleteCartProduct = async (req, res, _next) => {
    const prodId = req.body.productId;
    await req.user.deleteFromCart(prodId);
    console.log('Deleted From Cart....');
    res.redirect('/cart');
};
exports.getOrders = async (req, res, _next) => {
    const orders = await order_1.default.find({ 'user.userId': req.user._id });
    res.render('shop/orders', {
        orders,
        path: '/orders',
        pageTitle: 'Your Orders',
    });
};
exports.postOrder = async (req, res, _next) => {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    const cartProducts = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: Object.assign({}, i.productId._doc),
    }));
    const order = new order_1.default({
        user: {
            email: req.user.email,
            userId: req.user._id,
        },
        products: cartProducts,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
};
exports.getInvoice = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const orderDoc = await order_1.default.findById(orderId);
        if (!orderDoc) {
            return next(new Error('Order Not Found...'));
        }
        if (orderDoc.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('You r unauthorized...'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path_1.default.join(rootDir_1.default, '..', 'data', 'invoices', invoiceName);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
        const pdfDoc = new pdfkit_1.default();
        pdfDoc.pipe(fs_1.default.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice', {
            underline: true,
        });
        pdfDoc.text('\n');
        // pdfDoc.text('---------------------------------')
        let totalPrice = 0;
        orderDoc.products.forEach((prod) => {
            pdfDoc
                .fontSize(14)
                .text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
            totalPrice += prod.quantity * prod.product.price;
        });
        pdfDoc.text('----------------------------------------');
        pdfDoc.text('\n');
        pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
        pdfDoc.end();
    }
    catch (err) {
        return next(err);
    }
};
exports.getCheckoutPage = async (req, res, _next) => {
    try {
        const user = await req.user
            .populate('cart.items.productId')
            .execPopulate();
        const cartProducts = user.cart.items;
        let total = 0;
        cartProducts.forEach((p) => {
            total += p.quantity * p.productId.price;
        });
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartProducts.map((p) => {
                return {
                    name: p.productId.title,
                    description: p.productId.description,
                    amount: p.productId.price * 100,
                    currency: 'usd',
                    quantity: p.quantity,
                };
            }),
            success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
        });
        res.render('shop/checkout', {
            products: cartProducts,
            path: '/checkout',
            pageTitle: 'Checkout',
            totalSum: total,
            sessionId: stripeSession.id,
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.getCheckoutSuccess = async (req, res, _next) => {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    const cartProducts = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: Object.assign({}, i.productId._doc),
    }));
    const order = new order_1.default({
        user: {
            email: req.user.email,
            userId: req.user._id,
        },
        products: cartProducts,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
};
//# sourceMappingURL=shop.js.map