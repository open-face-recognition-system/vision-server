import ClassesService from '@modules/semesters/services/ClassesService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ClassesTeacherController {
  public async list(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { teacherId } = request.params;
    const classesService = container.resolve(ClassesService);
    const classes = await classesService.listAllByTeacher(
      teacherId ? Number(teacherId) : userId,
      request.query,
    );
    return response.json(instanceToInstance(classes));
  }

  public async listMobile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const userId = request.user.id;
    const classesService = container.resolve(ClassesService);
    const classes = await classesService.listAllByTeacherForMobile(userId);
    return response.json(instanceToInstance(classes));
  }
}

export default ClassesTeacherController;
