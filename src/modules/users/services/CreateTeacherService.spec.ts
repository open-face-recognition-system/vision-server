import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateTeacherService from './CreateTeacherService';
import FakeTeachersRepository from '../repositories/fakes/FakeTeachersRepository';
import Role from '../infra/typeorm/entities/Role';

let fakeUsersRepository: FakeUsersRepository;
let fakeTeachersRepository: FakeTeachersRepository;
let createTeacherService: CreateTeacherService;

describe('Create Teacher', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeTeachersRepository = new FakeTeachersRepository();
    createTeacherService = new CreateTeacherService(
      fakeUsersRepository,
      fakeTeachersRepository,
    );
  });

  it('should be able to create a new teacher', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const teacher = await createTeacherService.execute({
      enrollment: '123123',
      userId: user.id,
    });

    expect(teacher).toHaveProperty('id');
    expect(teacher.user.role).toBe('teacher');
  });

  it('should not be able to create a new teacher with no user', async () => {
    await expect(
      createTeacherService.execute({
        enrollment: '123123',
        userId: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new teacher with user already linked', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await createTeacherService.execute({
      enrollment: '123123',
      userId: user.id,
    });

    await expect(
      createTeacherService.execute({
        enrollment: '123123',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new teacher with duplicate enrollment', async () => {
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

    await createTeacherService.execute({
      enrollment: '123123',
      userId: firstUser.id,
    });

    await expect(
      createTeacherService.execute({
        enrollment: '123123',
        userId: secondUser.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
