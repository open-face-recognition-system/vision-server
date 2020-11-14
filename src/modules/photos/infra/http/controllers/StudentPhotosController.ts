import { Request, Response } from 'express';
import { container } from 'tsyringe';
import StudentPhotosService from '@modules/photos/services/StudentPhotosService';

class StudentPhotosController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const photosService = container.resolve(StudentPhotosService);
    const photos = await photosService.showPhotos(userId);

    return response.json(photos);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { filename } = request.file;
    const { photoType } = request.query;

    const photosService = container.resolve(StudentPhotosService);
    const photo = await photosService.addPhoto(
      userId,
      String(photoType),
      filename,
    );

    return response.json(photo);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { filename } = request.file;

    const photosService = container.resolve(StudentPhotosService);
    const photo = await photosService.updatePhoto(Number(id), filename);

    return response.json(photo);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const photosService = container.resolve(StudentPhotosService);
    const photo = await photosService.deletePhoto(Number(id));

    return response.json(photo);
  }
}

export default StudentPhotosController;
