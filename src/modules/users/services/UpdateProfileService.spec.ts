import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import Role from '../infra/typeorm/entities/Role';
import FakeStudentsRepository from '../repositories/fakes/FakeStudentsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeStudentsRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const updatedUser = await updateProfileService.execute({
      userId: student.id,
      oldPassword: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    await expect(
      updateProfileService.execute({
        userId: student.id,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password wronh old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    await expect(
      updateProfileService.execute({
        userId: student.id,
        oldPassword: '123123',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the profile from non-existing user', async () => {
    expect(
      updateProfileService.execute({
        userId: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
