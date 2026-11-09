import SubjectsService from '@modules/subjects/services/SubjectsService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class EnrollStudentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { studentId } = request.body;

    const subjectsService = container.resolve(SubjectsService);
    const subjectStudent = await subjectsService.enrollStudent(
      Number(id),
      Number(studentId),
    );

    return response.status(201).json(instanceToInstance(subjectStudent));
  }
}

export default EnrollStudentController;
