import path from 'path';
import uploadConfig from '@config/upload';
import RecognitionService from '@modules/recognition/services/RecognitionService';

import { Request, Response } from 'express';
import { container } from 'tsyringe';

class RecognizeController {
  public async create(request: Request, response: Response): Promise<Response> {
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
}

export default RecognizeController;
