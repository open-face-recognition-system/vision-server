import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Service from '@shared/core/Service';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';
import Role from '../infra/typeorm/entities/Role';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService implements Service<IRequest, User> {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    return user;
  }
}

export default CreateUserService;
