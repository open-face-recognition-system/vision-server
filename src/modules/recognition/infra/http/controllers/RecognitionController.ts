import path from 'path';
import uploadConfig from '@config/upload';
import RecognitionService from '@modules/recognition/services/RecognitionService';

import { Request, Response } from 'express';
import { container } from 'tsyringe';

class RecognizeController {
  public async recognize(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { classId } = request.params;
    const { filename: file } = request.file;

    const filePath = path.join(uploadConfig.tmpFolder, file);

    const subjectsService = container.resolve(RecognitionService);
    const student = await subjectsService.recognize({
      classId: Number(classId),
      filePath,
    });

    return response.status(200).json(student);
  }

  public async training(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { subjectId } = request.params;

    const subjectsService = container.resolve(RecognitionService);
    await subjectsService.training({
      subjectId: Number(subjectId),
    });

    return response.status(204).json();
  }
}

export default RecognizeController;
