import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Service from '@shared/core/Service';
import IUsersRepository from '../repositories/IUsersRepository';
import Teacher from '../infra/typeorm/entities/Teacher';
import ITeachersRepository from '../repositories/ITeachersRepository';
import Role from '../infra/typeorm/entities/Role';

interface IRequest {
  enrollment: string;
  userId: number;
}

@injectable()
class CreateTeacherService implements Service<IRequest, Teacher> {
  private usersRepository: IUsersRepository;

  private teachersRepository: ITeachersRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
  ) {
    this.usersRepository = usersRepository;
    this.teachersRepository = teachersRepository;
  }

  public async execute({ enrollment, userId }: IRequest): Promise<Teacher> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.role !== Role.ADMIN) {
      throw new AppError('User already linked to another');
    }

    const duplicateEnrollment = await this.teachersRepository.findByEnrollment(
      enrollment,
    );

    if (duplicateEnrollment) {
      throw new AppError('Duplicate enrollment');
    }

    user.role = Role.TEACHER;
    await this.usersRepository.save(user);

    const teacher = await this.teachersRepository.create({
      enrollment,
      user,
    });

    return teacher;
  }
}

export default CreateTeacherService;
