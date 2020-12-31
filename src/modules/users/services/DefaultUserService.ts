import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';

import Student from '../infra/typeorm/entities/Student';
import Teacher from '../infra/typeorm/entities/Teacher';
import IStudentsRepository from '../repositories/IStudentsRepository';
import ITeachersRepository from '../repositories/ITeachersRepository';

@injectable()
class DefaultUserService {
  private studentsRepository: IStudentsRepository;

  private teachersRepository: ITeachersRepository;

  constructor(
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
  ) {
    this.studentsRepository = studentsRepository;
    this.teachersRepository = teachersRepository;
  }

  public async findStudentById(studentId: number): Promise<Student> {
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    return student;
  }

  public async findTeacherById(teacherId: number): Promise<Teacher> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    return teacher;
  }

  public async findAllStudents(): Promise<PaginationAwareObject> {
    const students = await this.studentsRepository.findAllWithPagination();
    return students;
  }

  public async findAllTeachers(): Promise<PaginationAwareObject> {
    const teachers = await this.teachersRepository.findAllWithPagination();
    return teachers;
  }
}

export default DefaultUserService;
