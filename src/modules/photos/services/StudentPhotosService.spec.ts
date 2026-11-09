import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import Role from '@modules/users/infra/typeorm/entities/Role';
import FakeStudentsRepository from '@modules/users/repositories/fakes/FakeStudentsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import studentPhotosConfig from '@config/studentPhotos';
import StudentPhotosService from './StudentPhotosService';
import FakePhotosRepository from '../repositories/fakes/FakePhotosRepository';

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
      'normal',
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

    await studentPhotosService.addPhoto(student.id, 'normal', 'filename');

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
      'normal',
      'filename',
    );

    const response = await studentPhotosService.updatePhoto(student.id, photo.id, 'newfilename');

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
      'normal',
      'filename',
    );

    await studentPhotosService.deletePhoto(student.id, photo.id);

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
      'normal',
      'smilling',
      'closedEyes',
      'rightSide',
      'leftSide',
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

    await expect(
      studentPhotosService.addPhoto(student.id, 'normal', 'filename'),
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
      await studentPhotosService.addPhoto(student.id, 'normal', 'filename');
    }

    await expect(
      studentPhotosService.addPhoto(student.id, 'normal', 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add new user photo with enhandled photo type', async () => {
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

    await expect(
      studentPhotosService.addPhoto(student.id, 'unhandled', 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add new user photo with non existing user', async () => {
    await expect(
      studentPhotosService.addPhoto(0, 'normal', 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user photo with non existing photo', async () => {
    await expect(
      studentPhotosService.updatePhoto(1, 0, 'filename'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete user photo with non existing photo', async () => {
    await expect(studentPhotosService.deletePhoto(1, 0)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  describe('ownership', () => {
    const createStudentWithPhoto = async (email: string) => {
      const user = await fakeUsersRepository.create({ name: email, email, password: 'x', role: Role.STUDENT });
      const student = await fakeStudentsRepository.create({ user, enrollment: email });
      const photo = await studentPhotosService.addPhoto(student.id, 'normal', `${email}.jpg`);
      return { student, photo };
    };

    it('should not let a student replace a photo of another student', async () => {
      const victim = await createStudentWithPhoto('victim@example.com');
      const attacker = await createStudentWithPhoto('attacker@example.com');

      await expect(
        studentPhotosService.updatePhoto(attacker.student.id, victim.photo.id, 'evil.jpg'),
      ).rejects.toBeInstanceOf(AppError);
      expect((await fakePhotosRepository.findById(victim.photo.id))?.path).toBe('victim@example.com.jpg');
    });

    it('should not let a student delete a photo of another student', async () => {
      const victim = await createStudentWithPhoto('victim@example.com');
      const attacker = await createStudentWithPhoto('attacker@example.com');

      await expect(
        studentPhotosService.deletePhoto(attacker.student.id, victim.photo.id),
      ).rejects.toBeInstanceOf(AppError);
      expect(await fakePhotosRepository.findById(victim.photo.id)).toBeDefined();
    });
  });
});
