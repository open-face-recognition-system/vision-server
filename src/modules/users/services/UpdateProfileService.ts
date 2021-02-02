import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IStudentsRepository from '../repositories/IStudentsRepository';
import ITeachersRepository from '../repositories/ITeachersRepository';

interface IRequest {
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private studentRepository: IStudentsRepository;

  private teachersRepository: ITeachersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('StudentsRepository')
    studentRepository: IStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.studentRepository = studentRepository;
    this.usersRepository = usersRepository;
    this.teachersRepository = teachersRepository;
    this.hashProvider = hashProvider;
  }

  public async updateTeacherProfile(
    id: number,
    { name, email, password, oldPassword }: IRequest,
  ): Promise<User> {
    const teacher = await this.teachersRepository.findById(id);

    if (!teacher) {
      throw new AppError('Teacher not found');
    }

    const { user } = teacher;

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

    user.email = email;
    user.name = name;

    return this.usersRepository.save(user);
  }

  public async updateStudentProfile(
    id: number,
    { name, email, password, oldPassword }: IRequest,
  ): Promise<User> {
    const student = await this.studentRepository.findById(id);

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

    user.email = email;
    user.name = name;

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
