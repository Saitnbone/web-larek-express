import express from 'express';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);

export default router;
