import SubjectsService from '@modules/subjects/services/SubjectsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class UnenrollStudentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { studentId } = request.body;

    const subjectsService = container.resolve(SubjectsService);
    await subjectsService.unenrollStudent(Number(id), Number(studentId));

    return response.status(204).json();
  }
}

export default UnenrollStudentController;
