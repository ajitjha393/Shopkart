import { Router } from 'express'
import {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	deleteProduct,
} from '../controllers/admin'

import { isAuth } from '../middleware/isAuth'

const router = Router()

router.get('/add-product', isAuth, getAddProduct)

router.get('/products', isAuth, getProducts)

router.post('/add-product', isAuth, postAddProduct)

router.get('/edit-product/:productId', isAuth, getEditProduct)
router.post('/edit-product', isAuth, postEditProduct)

router.post('/delete-product', isAuth, deleteProduct)
export default router
