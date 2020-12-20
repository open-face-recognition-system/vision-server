import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

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

  public async findAllStudents(take: number, skip: number): Promise<Student[]> {
    const students = await this.studentsRepository.listAll(take, skip);
    return students;
  }
}

export default DefaultUserService;
