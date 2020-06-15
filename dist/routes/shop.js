"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_1 = require("../controllers/shop");
const isAuth_1 = require("../middleware/isAuth");
// // It acts like mini express App
const router = express_1.Router();
router.get('/', shop_1.getIndexPage);
router.get('/products', shop_1.getProducts);
router.get('/products/:productId', shop_1.getProductDetails);
router.get('/cart', isAuth_1.isAuth, shop_1.getCart);
router.post('/cart', isAuth_1.isAuth, shop_1.postCart);
router.post('/cart-delete-item', isAuth_1.isAuth, shop_1.deleteCartProduct);
router.get('/orders', isAuth_1.isAuth, shop_1.getOrders);
router.get('/orders/:orderId', isAuth_1.isAuth, shop_1.getInvoice);
// router.post('/create-order', isAuth, postOrder)
router.get('/checkout', isAuth_1.isAuth, shop_1.getCheckoutPage);
router.get('/checkout/success', isAuth_1.isAuth, shop_1.getCheckoutSuccess);
router.get('/checkout/cancel', isAuth_1.isAuth, shop_1.getCheckoutPage);
exports.default = router;
//# sourceMappingURL=shop.js.map