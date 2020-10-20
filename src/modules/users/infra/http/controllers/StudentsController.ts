import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateStudentService from '@modules/users/services/CreateStudentService';

export default class StudentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { enrollment, userId } = request.body;

    const createStudentService = container.resolve(CreateStudentService);
    const student = await createStudentService.execute({ enrollment, userId });

    return response.json(classToClass(student));
  }
}
