import { Router } from 'express'
import {
	getProducts,
	getIndexPage,
	getCart,
	getCheckoutPage,
	getOrders,
	postOrder,
	getProductDetails,
	postCart,
	deleteCartProduct,
	getInvoice,
} from '../controllers/shop'

import { isAuth } from '../middleware/isAuth'

// // It acts like mini express App
const router = Router()

router.get('/', getIndexPage)

router.get('/products', getProducts)

router.get('/products/:productId', getProductDetails)

router.get('/cart', isAuth, getCart)
router.post('/cart', isAuth, postCart)
router.post('/cart-delete-item', isAuth, deleteCartProduct)

router.get('/orders', isAuth, getOrders)
router.get('/orders/:orderId', isAuth, getInvoice)
router.post('/create-order', isAuth, postOrder)
router.get('/checkout', isAuth, getCheckoutPage)

export default router
