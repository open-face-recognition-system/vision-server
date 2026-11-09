import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';

import cors from 'cors';
import { MulterError } from 'multer';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './api/v1';

import '@shared/container';

const app = express();

app.use(express.json());
app.get('/health', (_, response) => response.json(true));
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(cors());
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof MulterError) {
    return response.status(400).json({ status: 'error', message: err.message });
  }

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
