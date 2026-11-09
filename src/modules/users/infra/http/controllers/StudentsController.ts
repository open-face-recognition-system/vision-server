import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';
import CreateStudentService from '@modules/users/services/CreateStudentService';
import DefaultUserService from '@modules/users/services/DefaultUserService';

class StudentsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const defaultUserService = container.resolve(DefaultUserService);
    const students = await defaultUserService.findAllStudents(request.query);

    return response.json(instanceToInstance(students));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const defaultUserService = container.resolve(DefaultUserService);
    const student = await defaultUserService.findStudentById(Number(id));

    return response.json(instanceToInstance(student));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, enrollment } = request.body;

    const createStudentService = container.resolve(CreateStudentService);
    const student = await createStudentService.execute({ name, email, password, enrollment });

    return response.json(instanceToInstance(student));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email } = request.body;

    const updateStudent = container.resolve(DefaultUserService);
    const teacher = await updateStudent.updateStudent(Number(id), {
      name,
      email,
    });

    return response.json(instanceToInstance(teacher));
  }
}

export default StudentsController;
