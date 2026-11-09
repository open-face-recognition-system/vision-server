import { Request, Response } from 'express';
import { container } from 'tsyringe';
import StudentPhotosService from '@modules/photos/services/StudentPhotosService';
import uploadedFile from '@shared/infra/http/uploadedFile';

class StudentPhotosController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const photosService = container.resolve(StudentPhotosService);
    const photos = await photosService.showPhotos(userId);

    return response.json(photos);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const filename = uploadedFile(request);
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
    const filename = uploadedFile(request);

    const photosService = container.resolve(StudentPhotosService);
    const photo = await photosService.updatePhoto(request.user.id, Number(id), filename);

    return response.json(photo);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const photosService = container.resolve(StudentPhotosService);
    const photo = await photosService.deletePhoto(request.user.id, Number(id));

    return response.json(photo);
  }
}

export default StudentPhotosController;
