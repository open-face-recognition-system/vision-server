import AttendencesService from '@modules/semesters/services/AttendencesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class AttendencesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const attendencesService = container.resolve(AttendencesService);
    const attendences = await attendencesService.listAttendences();
    return response.json(classToClass(attendences));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const attendencesService = container.resolve(AttendencesService);
    const attendence = await attendencesService.showAttendence(Number(id));

    return response.json(classToClass(attendence));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { isPresent, classId, studentId } = request.body;

    const attendencesService = container.resolve(AttendencesService);
    const attendence = await attendencesService.createAttendence({
      isPresent,
      classId,
      studentId,
    });

    return response.status(201).json(classToClass(attendence));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { isPresent, classId, studentId } = request.body;

    const attendencesService = container.resolve(AttendencesService);
    const attendence = await attendencesService.updateAttendence(Number(id), {
      isPresent,
      classId,
      studentId,
    });

    return response.json(classToClass(attendence));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const attendencesService = container.resolve(AttendencesService);
    await attendencesService.deleteAttendence(Number(id));

    return response.status(204).json();
  }
}

export default AttendencesController;
