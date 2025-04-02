// eslint-disable-next-line import/no-import-module-exports
import mongoose from 'mongoose';
import { IProduct } from '../types/types';

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
    unique: true,
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Поле "fileName" должно быть заполнено'],
    },
    originalName: {
      type: String,
      required: [true, 'Поле "originalName" должно быть заполнено'],
    },
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [false, 'Поле "description" не обязательно для заполнения'],
  },
  price: {
    type: Number,
    required: [false, 'Поле "price" не обязательно для заполнения'],
    default: null,
  },
});

export default mongoose.model<IProduct>('Product', productSchema);
