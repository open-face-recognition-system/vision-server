import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void | Error {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing.');
  }

  const [, token] = authHeader.split(' ');

  try {
    jwt.verify(token, authConfig.jwt.secret);

    return next();
  } catch {
    throw new AppError('Invalid JWT token');
  }
}
