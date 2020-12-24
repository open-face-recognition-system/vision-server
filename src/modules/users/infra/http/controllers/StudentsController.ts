import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateStudentService from '@modules/users/services/CreateStudentService';
import DefaultUserService from '@modules/users/services/DefaultUserService';

class StudentsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const defaultUserService = container.resolve(DefaultUserService);
    const students = await defaultUserService.findAllStudents();

    return response.json(classToClass(students));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const defaultUserService = container.resolve(DefaultUserService);
    const student = await defaultUserService.findStudentById(Number(id));

    return response.json(classToClass(student));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { enrollment, userId } = request.body;

    const createStudentService = container.resolve(CreateStudentService);
    const student = await createStudentService.execute({ enrollment, userId });

    return response.json(classToClass(student));
  }
}

export default StudentsController;
