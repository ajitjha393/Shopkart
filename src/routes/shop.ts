import { Router } from 'express';
import { getProducts } from '../controllers/products';

// It acts like mini express App
const router = Router();

router.get('/', getProducts);

export default router;
