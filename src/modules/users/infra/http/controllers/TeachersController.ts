import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateTeacherService from '@modules/users/services/CreateTeacherService';
import DefaultUserService from '@modules/users/services/DefaultUserService';

class TeachersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const defaultUserService = container.resolve(DefaultUserService);
    const teachers = await defaultUserService.findAllTeachers(request.query);

    return response.json(classToClass(teachers));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const defaultUserService = container.resolve(DefaultUserService);
    const teacher = await defaultUserService.findTeacherById(Number(id));

    return response.json(classToClass(teacher));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { enrollment, userId } = request.body;

    const createTeacherService = container.resolve(CreateTeacherService);
    const teacher = await createTeacherService.execute({ enrollment, userId });

    return response.json(classToClass(teacher));
  }
}

export default TeachersController;
