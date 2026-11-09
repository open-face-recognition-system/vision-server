import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import Role from '../infra/typeorm/entities/Role';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class EnsureAdminService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<void> {
    if (await this.usersRepository.findByEmail(email)) return;

    await this.usersRepository.create({
      name: 'Admin',
      email,
      password: await this.hashProvider.generateHash(password),
      role: Role.ADMIN,
    });
  }
}

export default EnsureAdminService;
