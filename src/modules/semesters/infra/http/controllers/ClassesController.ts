import ClassesService from '@modules/semesters/services/ClassesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ClassesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const classesService = container.resolve(ClassesService);
    const classes = await classesService.listClasses();
    return response.json(classToClass(classes));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const classesService = container.resolve(ClassesService);
    const semester = await classesService.showClass(Number(id));

    return response.json(classToClass(semester));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { startHour, endHour, date, semesterId, subjectId } = request.body;

    const classesService = container.resolve(ClassesService);
    const newClass = await classesService.createClass({
      startHour,
      endHour,
      date,
      semesterId,
      subjectId,
    });

    return response.status(201).json(classToClass(newClass));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { startHour, endHour, date, semesterId, subjectId } = request.body;

    const classesService = container.resolve(ClassesService);
    const updateClass = await classesService.updateClass(Number(id), {
      startHour,
      endHour,
      date,
      semesterId,
      subjectId,
    });

    return response.json(classToClass(updateClass));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const classesService = container.resolve(ClassesService);
    await classesService.deleteClass(Number(id));

    return response.status(204).json();
  }
}

export default ClassesController;
