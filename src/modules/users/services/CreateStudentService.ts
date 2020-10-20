import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Service from '@shared/core/Service';
import IUsersRepository from '../repositories/IUsersRepository';
import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';
import Role from '../infra/typeorm/entities/Role';

interface IRequest {
  enrollment: string;
  userId: number;
}

@injectable()
class CreateStudentService implements Service<IRequest, Student> {
  private usersRepository: IUsersRepository;

  private studentsRepository: IStudentsRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
  ) {
    this.usersRepository = usersRepository;
    this.studentsRepository = studentsRepository;
  }

  public async execute({ enrollment, userId }: IRequest): Promise<Student> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.role !== Role.ADMIN) {
      throw new AppError('User already linked to another');
    }

    const duplicateEnrollment = await this.studentsRepository.findByEnrollment(
      enrollment,
    );

    if (duplicateEnrollment) {
      throw new AppError('Duplicate enrollment');
    }

    user.role = Role.STUDENT;
    await this.usersRepository.save(user);

    const student = await this.studentsRepository.create({
      enrollment,
      user,
    });

    return student;
  }
}

export default CreateStudentService;
