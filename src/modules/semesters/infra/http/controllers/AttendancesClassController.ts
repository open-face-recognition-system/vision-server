import AttendancesService from '@modules/semesters/services/AttendancesService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class AttendancesClassController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { classId } = request.params;
    const attendancesService = container.resolve(AttendancesService);
    const attendances = await attendancesService.listAllByClass(
      Number(classId),
    );
    return response.json(instanceToInstance(attendances));
  }
}

export default AttendancesClassController;
