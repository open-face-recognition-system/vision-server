import { Request, Response } from 'express';
import { container } from 'tsyringe';
import Training from '../Training';
import Recognition from '../Recognition';

class ValidationController {
  public async training(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const training = container.resolve(Training);
    const result = await training.training();

    return response.json(result);
  }

  public async recognize(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const recognition = container.resolve(Recognition);
    const result = await recognition.recognize();

    return response.json(result);
  }
}

export default ValidationController;
