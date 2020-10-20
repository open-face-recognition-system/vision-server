import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateStudentService from './CreateStudentService';
import FakeStudentsRepository from '../repositories/fakes/FakeStudentsRepository';
import Role from '../infra/typeorm/entities/Role';

let fakeUsersRepository: FakeUsersRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let createStudentService: CreateStudentService;

describe('Create Student', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    createStudentService = new CreateStudentService(
      fakeUsersRepository,
      fakeStudentsRepository,
    );
  });

  it('should be able to create a new student', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await createStudentService.execute({
      enrollment: '123123',
      userId: user.id,
    });

    expect(student).toHaveProperty('id');
    expect(student.user.role).toBe('student');
  });

  it('should not be able to create a new student with no user', async () => {
    await expect(
      createStudentService.execute({
        enrollment: '123123',
        userId: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new student with user already linked', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await createStudentService.execute({
      enrollment: '123123',
      userId: user.id,
    });

    await expect(
      createStudentService.execute({
        enrollment: '123123',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new student with duplicate enrollment', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const secondUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await createStudentService.execute({
      enrollment: '123123',
      userId: firstUser.id,
    });

    await expect(
      createStudentService.execute({
        enrollment: '123123',
        userId: secondUser.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
