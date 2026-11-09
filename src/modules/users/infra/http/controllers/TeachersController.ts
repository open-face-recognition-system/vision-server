import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';
import CreateTeacherService from '@modules/users/services/CreateTeacherService';
import DefaultUserService from '@modules/users/services/DefaultUserService';

class TeachersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const defaultUserService = container.resolve(DefaultUserService);
    const teachers = await defaultUserService.findAllTeachers(request.query);

    return response.json(instanceToInstance(teachers));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const defaultUserService = container.resolve(DefaultUserService);
    const teacher = await defaultUserService.findTeacherById(Number(id));

    return response.json(instanceToInstance(teacher));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, enrollment } = request.body;

    const createTeacherService = container.resolve(CreateTeacherService);
    const teacher = await createTeacherService.execute({ name, email, password, enrollment });

    return response.json(instanceToInstance(teacher));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email } = request.body;

    const createTeacherService = container.resolve(DefaultUserService);
    const teacher = await createTeacherService.updateTeacher(Number(id), {
      name,
      email,
    });

    return response.json(instanceToInstance(teacher));
  }
}

export default TeachersController;
