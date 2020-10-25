import { Request, Response } from 'express';
import { container } from 'tsyringe';
import PhotosService from '@modules/photos/services/PhotosService';

class PhotosController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const photosService = container.resolve(PhotosService);
    const photos = await photosService.showUserPhotos(userId);

    return response.json(photos);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { filename } = request.file;

    const photosService = container.resolve(PhotosService);
    const photo = await photosService.addUserPhoto(userId, filename);

    return response.json(photo);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { filename } = request.file;

    const photosService = container.resolve(PhotosService);
    const photo = await photosService.updateUserPhoto(Number(id), filename);

    return response.json(photo);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const photosService = container.resolve(PhotosService);
    const photo = await photosService.deleteUserPhoto(Number(id));

    return response.json(photo);
  }
}

export default PhotosController;
