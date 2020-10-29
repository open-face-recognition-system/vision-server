import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import Role from '@modules/users/infra/typeorm/entities/Role';
import PhotosService from './PhotosService';
import FakePhotosRepository from '../repositories/fakes/FakePhotosRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakePhotosRepository: FakePhotosRepository;
let photosService: PhotosService;

describe('Photos Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakePhotosRepository = new FakePhotosRepository();

    photosService = new PhotosService(
      fakeUsersRepository,
      fakePhotosRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to add new user photo', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const response = await photosService.addUserPhoto(user.id, 'filename');

    expect(response).toHaveProperty('path');
  });

  it('should be able to show user photos', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await photosService.addUserPhoto(user.id, 'filename');

    const response = await photosService.showUserPhotos(user.id);

    expect(response).toHaveLength(1);
  });

  it('should be able to update user photo', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const photo = await photosService.addUserPhoto(user.id, 'filename');

    const response = await photosService.updateUserPhoto(
      photo.id,
      'newfilename',
    );

    expect(response.path).toBe('newfilename');
  });

  it('should be able to delete user photo', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const photo = await photosService.addUserPhoto(user.id, 'filename');

    await photosService.deleteUserPhoto(photo.id);

    const response = await photosService.showUserPhotos(user.id);

    expect(response).toHaveLength(0);
  });

  it('should not be able to add new user photo with non existing user', async () => {
    expect(photosService.addUserPhoto(0, 'filename')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to update user photo with non existing photo', async () => {
    expect(photosService.updateUserPhoto(0, 'filename')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to delete user photo with non existing photo', async () => {
    expect(photosService.deleteUserPhoto(0)).rejects.toBeInstanceOf(AppError);
  });
});
