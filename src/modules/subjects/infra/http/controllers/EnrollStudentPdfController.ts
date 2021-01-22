import SubjectsService from '@modules/subjects/services/SubjectsService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class EnrollStudentPdfController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { filename } = request.file;
    const subjectsService = container.resolve(SubjectsService);
    const subjectStudent = await subjectsService.createAndEnrollStudentsByPdf(
      Number(id),
      filename,
    );

    return response.status(201).json(classToClass(subjectStudent));
  }
}

export default EnrollStudentPdfController;
