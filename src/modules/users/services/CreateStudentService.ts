import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IStudentsRepository from '../repositories/IStudentsRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import Student from '../infra/typeorm/entities/Student';
import Role from '../infra/typeorm/entities/Role';

interface IRequest {
  name: string;
  email: string;
  password: string;
  enrollment: string;
}

@injectable()
class CreateStudentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password, enrollment }: IRequest): Promise<Student> {
    if (await this.usersRepository.findByEmail(email)) {
      throw new AppError('Email address already used');
    }

    if (await this.studentsRepository.findByEnrollment(enrollment)) {
      throw new AppError('Duplicate enrollment');
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password: await this.hashProvider.generateHash(password),
      role: Role.STUDENT,
    });

    return this.studentsRepository.create({ enrollment, user });
  }
}

export default CreateStudentService;
