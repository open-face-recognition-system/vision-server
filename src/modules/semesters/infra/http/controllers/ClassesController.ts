import ClassesService from '@modules/semesters/services/ClassesService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ClassesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const classesService = container.resolve(ClassesService);
    const classes = await classesService.listClasses(request.query);
    return response.json(instanceToInstance(classes));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const classesService = container.resolve(ClassesService);
    const semester = await classesService.showClass(Number(id));

    return response.json(instanceToInstance(semester));
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

    return response.status(201).json(instanceToInstance(newClass));
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

    return response.json(instanceToInstance(updateClass));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const classesService = container.resolve(ClassesService);
    await classesService.deleteClass(Number(id));

    return response.status(204).json();
  }
}

export default ClassesController;
