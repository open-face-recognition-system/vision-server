import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token, refreshToken } = await authenticateUser.signIn({
      email,
      password,
    });

    return response.json({ user: instanceToInstance(user), token, refreshToken });
  }
}

export default SessionsController;
