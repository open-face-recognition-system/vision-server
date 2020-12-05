import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import Role from '../infra/typeorm/entities/Role';
import FakeStudentsRepository from '../repositories/fakes/FakeStudentsRepository';
import FakeTeachersRepository from '../repositories/fakes/FakeTeachersRepository';
import FakeRefreshTokensRepository from '../repositories/fakes/FakeRefreshTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let fakeTeachersRepository: FakeTeachersRepository;
let fakeRefreshTokensRepository: FakeRefreshTokensRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeTeachersRepository = new FakeTeachersRepository();
    fakeRefreshTokensRepository = new FakeRefreshTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeStudentsRepository,
      fakeTeachersRepository,
      fakeRefreshTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a admin', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const response = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should be able to authenticate a admin two times', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    const response = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should be able to authenticate a student', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const response = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should be able to authenticate a user if student does not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const response = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should be able to authenticate a teacher', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    await fakeTeachersRepository.create({
      enrollment: '123123',
      user,
    });

    const response = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should be able to authenticate a user if teacher does not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const response = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should be able to refresh a token with valid refreshToken', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const { refreshToken } = await authenticateUser.signIn({
      email: 'johndoe@example.com',
      password: '123123',
    });

    const response = await authenticateUser.refreshToken(refreshToken);

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    expect(
      authenticateUser.signIn({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    await expect(
      authenticateUser.signIn({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh token with non existing token', async () => {
    expect(
      authenticateUser.refreshToken('invalidRefreshToken'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh token with non existing token', async () => {
    expect(
      authenticateUser.refreshToken('07aeb8e6-e1b2-4115-bec4-04b9e13a925a'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
