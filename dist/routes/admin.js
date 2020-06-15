"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const express_validator_1 = require("express-validator");
const isAuth_1 = require("../middleware/isAuth");
const router = express_1.Router();
router.get('/add-product', isAuth_1.isAuth, admin_1.getAddProduct);
router.get('/products', isAuth_1.isAuth, admin_1.getProducts);
router.post('/add-product', isAuth_1.isAuth, [
    express_validator_1.body('title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must have a minimum length of 3'),
    express_validator_1.body('imageUrl') /*.isURL().withMessage('Please enter a valid Url!')*/,
    express_validator_1.body('price').isFloat(),
    express_validator_1.body('description')
        .trim()
        .isLength({ min: 4, max: 500 })
        .withMessage('Please provide a description for the product '),
], admin_1.postAddProduct);
router.get('/edit-product/:productId', isAuth_1.isAuth, admin_1.getEditProduct);
router.post('/edit-product', isAuth_1.isAuth, [
    express_validator_1.body('title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must have a minimum length of 3'),
    express_validator_1.body('imageUrl'),
    express_validator_1.body('price').isFloat(),
    express_validator_1.body('description')
        .trim()
        .isLength({ min: 4, max: 500 })
        .withMessage('Please provide a description for the product '),
], admin_1.postEditProduct);
router.delete('/product/:productId', isAuth_1.isAuth, admin_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=admin.js.map