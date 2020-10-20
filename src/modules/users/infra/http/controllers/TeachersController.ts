import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateTeacherService from '@modules/users/services/CreateTeacherService';

export default class TeachersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { enrollment, userId } = request.body;

    const createTeacherService = container.resolve(CreateTeacherService);
    const teacher = await createTeacherService.execute({ enrollment, userId });

    return response.json(classToClass(teacher));
  }
}
