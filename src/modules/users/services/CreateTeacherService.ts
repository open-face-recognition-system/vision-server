import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import ITeachersRepository from '../repositories/ITeachersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import Teacher from '../infra/typeorm/entities/Teacher';
import Role from '../infra/typeorm/entities/Role';

interface IRequest {
  name: string;
  email: string;
  password: string;
  enrollment: string;
}

@injectable()
class CreateTeacherService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('TeachersRepository')
    private teachersRepository: ITeachersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password, enrollment }: IRequest): Promise<Teacher> {
    if (await this.usersRepository.findByEmail(email)) {
      throw new AppError('Email address already used');
    }

    if (await this.teachersRepository.findByEnrollment(enrollment)) {
      throw new AppError('Duplicate enrollment');
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password: await this.hashProvider.generateHash(password),
      role: Role.TEACHER,
    });

    return this.teachersRepository.create({ enrollment, user });
  }
}

export default CreateTeacherService;
