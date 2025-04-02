import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import HttpStatus from '../constants';
import BadRequestError from '../errors/bad-request-error';

const validPayments = {
  CARD: 'card',
  ONLINE: 'online',
} as const;

type PaymentMethod = (typeof validPayments)[keyof typeof validPayments];

interface OrderRequest {
  total: number;
  items: string[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
}

const createOrder = asyncHandler(
  async (
    req: Request<{}, {}, OrderRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        total, items, payment, email, phone, address,
      } = req.body;

      // Проверка товаров
      const products = await Promise.all(
        items.map((id: string) => Product.findById(id)),
      );

      // Валидация товаров
      const totalPrice = products.reduce((sum, product) => {
        if (!product || product.price === null) {
          throw new BadRequestError(
            'Некоторые товары не найдены или имеют некорректную цену',
            HttpStatus.BAD_REQUEST,
          );
        }
        return sum + product.price;
      }, 0);

      // Проверка общей суммы
      if (totalPrice !== total) {
        throw new BadRequestError(
          'Общая сумма не соответствует стоимости товаров',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Проверка способа оплаты
      if (!Object.values(validPayments).includes(payment)) {
        throw new BadRequestError(
          'Некорректный способ оплаты',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestError('Некорректный email', HttpStatus.BAD_REQUEST);
      }

      // Валидация телефона и адреса
      if (typeof phone !== 'string' || !phone.trim()) {
        throw new BadRequestError(
          'Некорректный номер телефона',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (typeof address !== 'string' || !address.trim()) {
        throw new BadRequestError('Некорректный адрес', HttpStatus.BAD_REQUEST);
      }

      // Успешный ответ
      res.status(HttpStatus.OK).json({
        id: faker.database.mongodbObjectId(),
        total,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default createOrder;
