import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';

import Student from '../infra/typeorm/entities/Student';
import IStudentsRepository from '../repositories/IStudentsRepository';

@injectable()
class DefaultUserService {
  private studentsRepository: IStudentsRepository;

  constructor(
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
  ) {
    this.studentsRepository = studentsRepository;
  }

  public async findStudentById(studentId: number): Promise<Student> {
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    return student;
  }

  public async findAllStudents(): Promise<PaginationAwareObject> {
    const students = await this.studentsRepository.findAllWithPagination();
    return students;
  }
}

export default DefaultUserService;
