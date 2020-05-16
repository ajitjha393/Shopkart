import { Router } from 'express';
import {
	getProducts,
	getIndexPage,
	getCart,
	getCheckoutPage,
	getOrders,
} from '../controllers/shop';

// It acts like mini express App
const router = Router();

router.get('/', getIndexPage);

router.get('/products', getProducts);

router.get('/cart', getCart);
router.get('/orders', getOrders);

router.get('/checkout', getCheckoutPage);

export default router;
