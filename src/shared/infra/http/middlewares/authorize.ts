import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import Role from '@modules/users/infra/typeorm/entities/Role';

interface ITokenPayload {
  id: number;
  role: Role;
}

export const STAFF = [Role.ADMIN, Role.TEACHER];

export default function authorize(...roles: Role[]): RequestHandler {
  return (request: Request, _: Response, next: NextFunction) => {
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('JWT token is missing', 401);
    }

    let payload: ITokenPayload;
    try {
      payload = verify(token, authConfig.jwt.secret) as ITokenPayload;
    } catch {
      throw new AppError('Invalid JWT token', 401);
    }

    if (!roles.includes(payload.role)) {
      throw new AppError(`The role ${payload.role} cannot access this resource`, 403);
    }

    request.user = { id: payload.id, role: payload.role };
    next();
  };
}
