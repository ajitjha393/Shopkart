import { Router } from 'express';
import {
	getProducts,
	getIndexPage,
	getCart,
	getCheckoutPage,
	getOrders,
	getProductDetails,
	postCart,
	deleteCartProduct,
} from '../controllers/shop';

// It acts like mini express App
const router = Router();

router.get('/', getIndexPage);

router.get('/products', getProducts);
router.get('/products/:productId', getProductDetails);

router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart-delete-item', deleteCartProduct);

router.get('/orders', getOrders);

router.get('/checkout', getCheckoutPage);

export default router;
