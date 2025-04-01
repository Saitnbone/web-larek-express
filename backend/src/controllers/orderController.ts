import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import HttpStatus from '../constants';

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    total, items, payment, email, phone, address,
  } = req.body;

  // console.log('Received order:', req.body);

  const products = await Promise.all(
    items.map((id: string) => Product.findById(id)),
  );

  let totalPrice: number = 0;

  /* eslint-disable no-restricted-syntax */
  for (const product of products) {
    if (!product || product.price === null) {
      res.status(HttpStatus.VALIDATION_ERROR);
      throw new Error(
        'Переданы некорректные данные в методы создания товара, заказа',
      );
    }
    totalPrice += product.price;
  }
  /* eslint-enable no-restricted-syntax */

  if (totalPrice !== total) {
    res.status(HttpStatus.VALIDATION_ERROR);
    throw new Error(
      'Переданы некорректные данные в методы создания товара, заказа',
    );
  }

  const validPayments = {
    CARD: 'card',
    ONLINE: 'online',
  };
  if (payment !== validPayments.CARD && payment !== validPayments.ONLINE) {
    res.status(HttpStatus.VALIDATION_ERROR);
    throw new Error(
      'Переданы некорректные данные в методы создания товара, заказа',
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(HttpStatus.VALIDATION_ERROR);
    throw new Error(
      'Переданы некорректные данные в методы создания товара, заказа',
    );
  }

  if (!phone || typeof phone !== 'string') {
    res.status(HttpStatus.VALIDATION_ERROR);
    throw new Error(
      'Переданы некорректные данные в методы создания товара, заказа',
    );
  }

  if (!address || typeof address !== 'string') {
    res.status(HttpStatus.VALIDATION_ERROR);
    throw new Error(
      'Переданы некорректные данные в методы создания товара, заказа',
    );
  }

  res.status(HttpStatus.OK).json({
    id: faker.database.mongodbObjectId(),
    total,
  });
});

export default createOrder;
