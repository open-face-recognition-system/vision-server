import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import EnsureAdminService from './EnsureAdminService';
import Role from '../infra/typeorm/entities/Role';

describe('EnsureAdminService', () => {
  let usersRepository: FakeUsersRepository;
  let ensureAdminService: EnsureAdminService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    ensureAdminService = new EnsureAdminService(usersRepository, new FakeHashProvider());
  });

  it('creates the admin when the email is unknown', async () => {
    await ensureAdminService.execute({ email: 'admin@vision.local', password: 'secret' });

    expect(await usersRepository.findByEmail('admin@vision.local')).toMatchObject({
      role: Role.ADMIN,
      password: 'secret',
    });
  });

  it('leaves an existing user untouched', async () => {
    await usersRepository.create({ name: 'Admin', email: 'admin@vision.local', password: 'old', role: Role.ADMIN });
    const create = jest.spyOn(usersRepository, 'create');

    await ensureAdminService.execute({ email: 'admin@vision.local', password: 'new' });

    expect(create).not.toHaveBeenCalled();
  });
});
