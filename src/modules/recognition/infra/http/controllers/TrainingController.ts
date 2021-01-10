import RecognitionService from '@modules/recognition/services/RecognitionService';

import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TrainingController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { subjectId } = request.params;

    const subjectsService = container.resolve(RecognitionService);
    await subjectsService.training({
      subjectId: Number(subjectId),
    });

    return response.status(204).json();
  }
}

export default TrainingController;
