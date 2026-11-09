import SemestersService from '@modules/semesters/services/SemestersService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class SemestersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const semestersService = container.resolve(SemestersService);
    const semesters = await semestersService.listSemesters(request.query);
    return response.json(instanceToInstance(semesters));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const semestersService = container.resolve(SemestersService);
    const semester = await semestersService.showSemester(Number(id));

    return response.json(instanceToInstance(semester));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { startDate, endDate } = request.body;

    const semestersService = container.resolve(SemestersService);
    const semester = await semestersService.createSemester({
      startDate,
      endDate,
    });

    return response.status(201).json(instanceToInstance(semester));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { startDate, endDate } = request.body;

    const semestersService = container.resolve(SemestersService);
    const semester = await semestersService.updateSemester(Number(id), {
      startDate,
      endDate,
    });

    return response.json(instanceToInstance(semester));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const semestersService = container.resolve(SemestersService);
    await semestersService.deleteSemester(Number(id));

    return response.status(204).json();
  }
}

export default SemestersController;
