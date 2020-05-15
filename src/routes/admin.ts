import { Router } from 'express';
import {
	getAddProduct,
	postAddProduct,
	getProducts,
} from '../controllers/admin';

const router = Router();

router.get('/add-product', getAddProduct);

router.get('/products', getProducts);

router.post('/add-product', postAddProduct);

export default router;
