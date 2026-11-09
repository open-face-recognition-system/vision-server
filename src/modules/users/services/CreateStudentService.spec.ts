import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateStudentService from './CreateStudentService';
import FakeStudentsRepository from '../repositories/fakes/FakeStudentsRepository';
import Role from '../infra/typeorm/entities/Role';

const signUp = { name: 'John Doe', email: 'johndoe@example.com', password: 'secret', enrollment: '123123' };

describe('CreateStudentService', () => {
  let usersRepository: FakeUsersRepository;
  let studentsRepository: FakeStudentsRepository;
  let createStudentService: CreateStudentService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    studentsRepository = new FakeStudentsRepository();
    createStudentService = new CreateStudentService(usersRepository, studentsRepository, new FakeHashProvider());
  });

  it('creates a user with the student role, never admin', async () => {
    const student = await createStudentService.execute(signUp);

    expect(student.enrollment).toBe('123123');
    expect(student.user).toMatchObject({ name: 'John Doe', email: 'johndoe@example.com', role: Role.STUDENT });
  });

  it('stores the hashed password', async () => {
    const hashProvider = new FakeHashProvider();
    jest.spyOn(hashProvider, 'generateHash').mockResolvedValue('hashed');
    createStudentService = new CreateStudentService(usersRepository, studentsRepository, hashProvider);

    const student = await createStudentService.execute(signUp);

    expect(student.user.password).toBe('hashed');
  });

  it('rejects an email already in use', async () => {
    await createStudentService.execute(signUp);

    await expect(createStudentService.execute({ ...signUp, enrollment: '999' })).rejects.toBeInstanceOf(AppError);
  });

  it('rejects a duplicate enrollment without creating an orphan user', async () => {
    await createStudentService.execute(signUp);

    await expect(
      createStudentService.execute({ ...signUp, email: 'other@example.com' }),
    ).rejects.toBeInstanceOf(AppError);
    expect(await usersRepository.findByEmail('other@example.com')).toBeUndefined();
  });
});
