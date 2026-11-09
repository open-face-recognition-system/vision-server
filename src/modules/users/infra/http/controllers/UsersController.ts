import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import DefaultUserService from '@modules/users/services/DefaultUserService';

class UsersController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateProfile = container.resolve(DefaultUserService);
    await updateProfile.deleteUser(Number(id));

    return response.status(204).json();
  }
}

export default UsersController;
