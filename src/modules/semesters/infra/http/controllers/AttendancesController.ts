import AttendancesService from '@modules/semesters/services/AttendancesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class AttendancesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const attendancesService = container.resolve(AttendancesService);
    const attendances = await attendancesService.listAttendances(request.query);
    return response.json(classToClass(attendances));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const attendancesService = container.resolve(AttendancesService);
    const attendance = await attendancesService.showAttendance(Number(id));

    return response.json(classToClass(attendance));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { isPresent, classId, studentId } = request.body;

    const attendancesService = container.resolve(AttendancesService);
    const attendance = await attendancesService.createAttendance({
      isPresent,
      classId,
      studentId,
    });

    return response.status(201).json(classToClass(attendance));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { isPresent, classId, studentId } = request.body;

    const attendancesService = container.resolve(AttendancesService);
    const attendance = await attendancesService.updateAttendance(Number(id), {
      isPresent,
      classId,
      studentId,
    });

    return response.json(classToClass(attendance));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const attendancesService = container.resolve(AttendancesService);
    await attendancesService.deleteAttendance(Number(id));

    return response.status(204).json();
  }
}

export default AttendancesController;
