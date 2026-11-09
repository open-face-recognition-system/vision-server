import SubjectsService from '@modules/subjects/services/SubjectsService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import uploadedFile from '@shared/infra/http/uploadedFile';

class EnrollStudentPdfController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const filename = uploadedFile(request);
    const subjectsService = container.resolve(SubjectsService);
    const subjectStudent = await subjectsService.createAndEnrollStudentsByPdf(
      Number(id),
      filename,
    );

    return response.status(201).json(instanceToInstance(subjectStudent));
  }
}

export default EnrollStudentPdfController;
