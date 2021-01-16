import ClassesService from '@modules/semesters/services/ClassesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ClassesTeacherController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { teacherId } = request.params;
    const classesService = container.resolve(ClassesService);
    const classes = await classesService.listAllByTeacher(Number(teacherId));
    return response.json(classToClass(classes));
  }
}

export default ClassesTeacherController;
