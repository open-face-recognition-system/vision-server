import SubjectsService from '@modules/subjects/services/SubjectsService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class SubjectsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const subjectsService = container.resolve(SubjectsService);
    const semesters = await subjectsService.listSubjects(request.query);
    return response.json(classToClass(semesters));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const subjectsService = container.resolve(SubjectsService);
    const semester = await subjectsService.showSubject(Number(id));

    return response.json(classToClass(semester));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, course, teacherId } = request.body;

    const subjectsService = container.resolve(SubjectsService);
    const semester = await subjectsService.createSubject({
      name,
      description,
      course,
      teacherId,
    });

    return response.status(201).json(classToClass(semester));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, description, course, teacherId } = request.body;

    const subjectsService = container.resolve(SubjectsService);
    const semester = await subjectsService.updateSubject(Number(id), {
      name,
      description,
      course,
      teacherId,
    });

    return response.json(classToClass(semester));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const subjectsService = container.resolve(SubjectsService);
    await subjectsService.deleteSubject(Number(id));

    return response.status(204).json();
  }
}

export default SubjectsController;
