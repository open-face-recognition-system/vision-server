import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  id: number;
  role: string;
}

export default function ensureAuthenticated(
  requiredRoles: string[],
  request: Request,
  response: Response,
  next: NextFunction,
): void | Error {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');
  let decoded;
  try {
    decoded = jwt.verify(token, authConfig.jwt.secret);
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }

  const { id, role } = decoded as ITokenPayload;

  if (!requiredRoles.includes(role)) {
    throw new AppError(`The role ${role} cannot access this resource`, 403);
  }

  request.user = {
    id,
    role,
  };
  return next();
}
