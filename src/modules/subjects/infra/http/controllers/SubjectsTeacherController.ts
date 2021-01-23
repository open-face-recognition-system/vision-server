import SubjectsService from '@modules/subjects/services/SubjectsService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class SubjectsTeacherController {
  public async list(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { teacherId } = request.params;
    const subjectsService = container.resolve(SubjectsService);
    const classes = await subjectsService.listAllByTeacher(
      teacherId ? Number(teacherId) : userId,
      request.query,
    );
    return response.json(classToClass(classes));
  }
}

export default SubjectsTeacherController;
