import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IStudentsRepository from '../repositories/IStudentsRepository';

interface IRequest {
  userId: number;
  password?: string;
  oldPassword?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private studentRepository: IStudentsRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('StudentsRepository')
    studentRepository: IStudentsRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.studentRepository = studentRepository;
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    userId,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const student = await this.studentRepository.findById(userId);

    if (!student) {
      throw new AppError('Student not found');
    }

    const { user } = student;

    if (password && !oldPassword) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
