import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';
import uploadedFile from '@shared/infra/http/uploadedFile';
import RecognitionService from '@modules/recognition/services/RecognitionService';

class RecognitionController {
  public async recognize(request: Request, response: Response): Promise<Response> {
    const { classId } = request.params;
    const file = uploadedFile(request);

    const recognition = await container.resolve(RecognitionService).recognize({
      classId: Number(classId),
      file,
    });

    return response.json(instanceToInstance(recognition));
  }

  public async training(request: Request, response: Response): Promise<Response> {
    const { subjectId } = request.params;

    await container.resolve(RecognitionService).training({ subjectId: Number(subjectId) });

    return response.status(204).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { studentId, classId } = request.params;
    const file = uploadedFile(request);

    await container.resolve(RecognitionService).update({
      studentId: Number(studentId),
      classId: Number(classId),
      file,
    });

    return response.status(204).send();
  }
}

export default RecognitionController;
