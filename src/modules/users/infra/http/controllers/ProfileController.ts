import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);
    const user = await showProfile.execute({ userId });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { oldPassword, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      userId,
      password,
      oldPassword,
    });

    return response.json(classToClass(user));
  }
}

export default ProfileController;
