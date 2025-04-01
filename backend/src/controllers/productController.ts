import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product';
import HttpStatus from '../constants';

const getProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find();

  if (products.length === 0) {
    res.status(HttpStatus.NOT_FOUND).json({ message: 'Продукты не найдены' });
  }

  res.status(HttpStatus.OK).json({
    items: products,
    total: products.length,
  });
});

const getProduct = asyncHandler(async (_req: Request, res: Response) => {
  const product = await Product.findById(_req.params.id);

  if (!product) {
    res.status(HttpStatus.NOT_FOUND).json({ message: 'Продукт не найден' });
  }

  res.status(HttpStatus.OK).json({
    item: product,
  });
});

const createProduct = asyncHandler(async (_req: Request, res: Response) => {
  const {
    description, image, title, category, price,
  } = _req.body;

  const { _id, ...imageData } = image;

  const product = await Product.create({
    title,
    image: imageData,
    category,
    description,
    price,
  });

  if (!product) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Не удалось создать продукт' });
  }

  res.status(HttpStatus.CREATE_OK).json({
    message: 'Продукт успешно создан',
    product,
  });
});

export { getProducts, createProduct, getProduct };
