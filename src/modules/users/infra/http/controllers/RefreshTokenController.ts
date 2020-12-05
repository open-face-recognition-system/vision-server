import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

class RefreshTokenController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const {
      user,
      token,
      refreshToken: newRefreshToken,
    } = await authenticateUser.refreshToken(refreshToken);

    return response.json({
      user: classToClass(user),
      token,
      refreshToken: newRefreshToken,
    });
  }
}

export default RefreshTokenController;
