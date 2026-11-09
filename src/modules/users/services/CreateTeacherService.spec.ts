import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateTeacherService from './CreateTeacherService';
import FakeTeachersRepository from '../repositories/fakes/FakeTeachersRepository';
import Role from '../infra/typeorm/entities/Role';

const signUp = { name: 'John Doe', email: 'johndoe@example.com', password: 'secret', enrollment: '123123' };

describe('CreateTeacherService', () => {
  let usersRepository: FakeUsersRepository;
  let teachersRepository: FakeTeachersRepository;
  let createTeacherService: CreateTeacherService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    teachersRepository = new FakeTeachersRepository();
    createTeacherService = new CreateTeacherService(usersRepository, teachersRepository, new FakeHashProvider());
  });

  it('creates a user with the teacher role, never admin', async () => {
    const teacher = await createTeacherService.execute(signUp);

    expect(teacher.enrollment).toBe('123123');
    expect(teacher.user).toMatchObject({ name: 'John Doe', email: 'johndoe@example.com', role: Role.TEACHER });
  });

  it('stores the hashed password', async () => {
    const hashProvider = new FakeHashProvider();
    jest.spyOn(hashProvider, 'generateHash').mockResolvedValue('hashed');
    createTeacherService = new CreateTeacherService(usersRepository, teachersRepository, hashProvider);

    const teacher = await createTeacherService.execute(signUp);

    expect(teacher.user.password).toBe('hashed');
  });

  it('rejects an email already in use', async () => {
    await createTeacherService.execute(signUp);

    await expect(createTeacherService.execute({ ...signUp, enrollment: '999' })).rejects.toBeInstanceOf(AppError);
  });

  it('rejects a duplicate enrollment without creating an orphan user', async () => {
    await createTeacherService.execute(signUp);

    await expect(
      createTeacherService.execute({ ...signUp, email: 'other@example.com' }),
    ).rejects.toBeInstanceOf(AppError);
    expect(await usersRepository.findByEmail('other@example.com')).toBeUndefined();
  });
});
