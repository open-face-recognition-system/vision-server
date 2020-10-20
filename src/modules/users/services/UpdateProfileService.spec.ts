import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import Role from '../infra/typeorm/entities/Role';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Test',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: Role.ADMIN,
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
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

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
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

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        oldPassword: '123123',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the profile from non-existing user', async () => {
    expect(
      updateProfileService.execute({
        userId: 0,
        name: 'John Trê',
        email: 'johntre@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
