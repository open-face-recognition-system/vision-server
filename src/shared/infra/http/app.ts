import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import { pagination } from 'typeorm-pagination';
import { errors } from 'celebrate';

import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './api/v1';

import '@shared/container';
import '@shared/infra/typeorm';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(
  '/recognitionFiles',
  express.static(uploadConfig.recognitionFilesFolder),
);
app.use(pagination);
app.use(cors());
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'internal server error',
  });
});

export default app;
