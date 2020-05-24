import { Router } from 'express';
import {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	deleteProduct,
} from '../controllers/admin';

const router = Router();

router.get('/add-product', getAddProduct);

router.get('/products', getProducts);

router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId', getEditProduct);
router.post('/edit-product', postEditProduct);

router.post('/delete-product', deleteProduct);
export default router;
