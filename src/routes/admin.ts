import { Router } from 'express'
import {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	deleteProduct,
} from '../controllers/admin'
import { body } from 'express-validator'

import { isAuth } from '../middleware/isAuth'

const router = Router()

router.get('/add-product', isAuth, getAddProduct)

router.get('/products', isAuth, getProducts)

router.post(
	'/add-product',
	isAuth,
	[
		body('title')
			.trim()
			.isString()
			.isLength({ min: 3 })
			.withMessage('Title must have a minimum length of 3'),

		body('imageUrl') /*.isURL().withMessage('Please enter a valid Url!')*/,
		body('price').isFloat(),
		body('description')
			.trim()
			.isLength({ min: 4, max: 500 })
			.withMessage('Please provide a description for the product '),
	],
	postAddProduct
)

router.get('/edit-product/:productId', isAuth, getEditProduct)
router.post(
	'/edit-product',
	isAuth,
	[
		body('title')
			.trim()
			.isString()
			.isLength({ min: 3 })
			.withMessage('Title must have a minimum length of 3'),

		body('imageUrl').isURL().withMessage('Please enter a valid Url!'),
		body('price').isFloat(),
		body('description')
			.trim()
			.isLength({ min: 4, max: 500 })
			.withMessage('Please provide a description for the product '),
	],
	postEditProduct
)

router.post('/delete-product', isAuth, deleteProduct)
export default router
