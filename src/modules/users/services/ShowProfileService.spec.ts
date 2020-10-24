import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import Role from '../infra/typeorm/entities/Role';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const updatedUser = await showProfileService.execute({
      userId: user.id,
    });

    expect(updatedUser.name).toBe('John Doe');
    expect(updatedUser.email).toBe('johndoe@example.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    expect(
      showProfileService.execute({
        userId: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
