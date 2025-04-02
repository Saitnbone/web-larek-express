import express from 'express';
import {
  getProducts,
  createProduct,
  getProduct,
} from '../controllers/productController';
import { ValidateProductBody, ValidateProductId } from '../middleware/validation';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/').post(ValidateProductBody, createProduct);
router.route('/:id').get(ValidateProductId, getProduct);

export default router;
