import express from 'express';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import HttpStatus from '../constants';
import NotFoundError from '../errors/not-found-error';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('*', (_req, _res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден', HttpStatus.NOT_FOUND));
});

export default router;
