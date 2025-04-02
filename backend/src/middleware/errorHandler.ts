import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode } = res;

  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  const errorResponse = {
    message: err.message || 'Что-то пошло не так',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  switch (statusCode) {
    case 400:
      res.status(400).json(new BadRequestError(err.message, 400));
      break;
    case 404:
      res.status(404).json(new NotFoundError(err.message, 404));
      break;
    case 409:
      res.status(409).json(new ConflictError(err.message, 409));
      break;
    default:
      res.status(500).json(errorResponse);
      break;
  }

  next();
};

export default errorHandler;
