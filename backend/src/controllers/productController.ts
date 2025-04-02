import { Error as MongooseError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product';
import HttpStatus from '../constants';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

const getProducts = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await Product.find();

      if (products.length === 0) {
        next(new NotFoundError('Продукты не найдены', HttpStatus.NOT_FOUND));
        return;
      }

      res.status(HttpStatus.OK).json({
        items: products,
        total: products.length,
      });
    } catch (error) {
      next(error);
    }
  },
);

const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        next(new NotFoundError('Продукт не найден', HttpStatus.NOT_FOUND));
        return;
      }

      res.status(HttpStatus.OK).json({
        item: product,
      });
    } catch (err) {
      if (err instanceof MongooseError.CastError) {
        next(new BadRequestError('Некорректный ID продукта', HttpStatus.BAD_REQUEST));
        return;
      }
      next(err);
    }
  },
);

const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        description, image, title, category, price,
      } = req.body;
      const { _id, ...imageData } = image;

      const product = await Product.create({
        title,
        image: imageData,
        category,
        description,
        price,
      });

      res.status(HttpStatus.CREATE_OK).json({
        message: 'Продукт успешно создан',
        product,
      });
    } catch (err) {
      if (err instanceof MongooseError.ValidationError) {
        const messages = Object.values(err.errors)
          .map((e) => e.message)
          .join(', ');
        next(new BadRequestError(messages, HttpStatus.BAD_REQUEST));
        return;
      }

      if (err instanceof Error && 'code' in err && err.code === 11000) {
        next(new ConflictError('Продукт с таким названием уже существует', HttpStatus.BAD_REQUEST));
        return;
      }

      next(err);
    }
  },
);

export { getProducts, createProduct, getProduct };
