import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Photo from '../infra/typeorm/entities/Photo';
import IPhotosRepository from '../repositories/IPhotosRepository';

@injectable()
class PhotosService {
  private usersRepository: IUsersRepository;

  private photosRepository: IPhotosRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('PhotosRepository')
    photosRepository: IPhotosRepository,
    @inject('StorageProvider')
    storageProvider: IStorageProvider,
  ) {
    this.usersRepository = usersRepository;
    this.photosRepository = photosRepository;
    this.storageProvider = storageProvider;
  }

  public async showUserPhotos(userId: number): Promise<Photo[]> {
    const photos = await this.photosRepository.listByUserId(userId);
    return photos;
  }

  public async addUserPhoto(userId: number, filename: string): Promise<Photo> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const path = await this.storageProvider.saveFile(filename);

    const photo = await this.photosRepository.create({
      path,
      user,
    });

    return photo;
  }

  public async updateUserPhoto(
    photoId: number,
    filename: string,
  ): Promise<Photo> {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new AppError('Photo does not exists');
    }

    await this.storageProvider.deleteFile(photo.path);
    const path = await this.storageProvider.saveFile(filename);

    photo.path = path;

    await this.photosRepository.save(photo);

    return photo;
  }

  public async deleteUserPhoto(photoId: number): Promise<void> {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new AppError('Photo does not exists');
    }

    await this.storageProvider.deleteFile(photo.path);
    await this.photosRepository.delete(photoId);
  }
}

export default PhotosService;