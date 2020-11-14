import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import Role from '@modules/users/infra/typeorm/entities/Role';
import FakeStudentsRepository from '@modules/users/repositories/fakes/FakeStudentsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import studentPhotosConfig from '@config/studentPhotos';
import StudentPhotosService from './StudentPhotosService';
import FakePhotosRepository from '../repositories/fakes/FakePhotosRepository';
import PhotoType from '../infra/typeorm/entities/PhotoType';

let fakeStudentsRepository: FakeStudentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakePhotosRepository: FakePhotosRepository;
let studentPhotosService: StudentPhotosService;

describe('Student Photos Service', () => {
  beforeEach(() => {
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakePhotosRepository = new FakePhotosRepository();

    studentPhotosService = new StudentPhotosService(
      fakeStudentsRepository,
      fakePhotosRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to add new user photo', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      user,
      enrollment: '123123',
    });

    const response = await studentPhotosService.addPhoto(
      student.id,
      PhotoType.NORMAL,
      'filename',
    );

    expect(response).toHaveProperty('path');
  });

  it('should be able to show user photos', async () => {
    const { photoLimit } = studentPhotosConfig;
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      user,
      enrollment: '123123',
    });

    await studentPhotosService.addPhoto(
      student.id,
      PhotoType.NORMAL,
      'filename',
    );

    const response = await studentPhotosService.showPhotos(student.id);

    expect(response).toHaveLength(photoLimit);
  });

  it('should be able to update user photo', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      user,
      enrollment: '123123',
    });

    const photo = await studentPhotosService.addPhoto(
      student.id,
      PhotoType.NORMAL,
      'filename',
    );

    const response = await studentPhotosService.updatePhoto(
      photo.id,
      'newfilename',
    );

    expect(response.path).toBe('newfilename');
  });

  it('should be able to delete user photo', async () => {
    const { photoLimit } = studentPhotosConfig;
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      user,
      enrollment: '123123',
    });

    const photo = await studentPhotosService.addPhoto(
      student.id,
      PhotoType.NORMAL,
      'filename',
    );

    await studentPhotosService.deletePhoto(photo.id);

    const response = await studentPhotosService.showPhotos(user.id);

    expect(response).toHaveLength(photoLimit);
  });

  it('should not be able to add new user photo with already reached photo limit', async () => {
    const { quantityOfEachPhoto } = studentPhotosConfig;

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      user,
      enrollment: '123123',
    });

    const photoTypes = [
      PhotoType.NORMAL,
      PhotoType.SMILING,
      PhotoType.CLOSED_EYES,
      PhotoType.RIGHT_SIDE,
      PhotoType.LEFT_SIDE,
    ];

    for (let i = 0; i < photoTypes.length; i += 1) {
      for (let j = 0; j < quantityOfEachPhoto; j += 1) {
        await studentPhotosService.addPhoto(
          student.id,
          photoTypes[i],
          'filename',
        );
      }
    }

    expect(
      studentPhotosService.addPhoto(student.id, PhotoType.NORMAL, 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add new user photo with already reached photo type limit', async () => {
    const { quantityOfEachPhoto } = studentPhotosConfig;

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      user,
      enrollment: '123123',
    });

    for (let j = 0; j < quantityOfEachPhoto; j += 1) {
      await studentPhotosService.addPhoto(
        student.id,
        PhotoType.NORMAL,
        'filename',
      );
    }

    expect(
      studentPhotosService.addPhoto(student.id, PhotoType.NORMAL, 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add new user photo with non existing user', async () => {
    expect(
      studentPhotosService.addPhoto(0, PhotoType.NORMAL, 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user photo with non existing photo', async () => {
    expect(
      studentPhotosService.updatePhoto(0, 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete user photo with non existing photo', async () => {
    expect(studentPhotosService.deletePhoto(0)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
