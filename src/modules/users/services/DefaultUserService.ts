import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
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

  private queryBuilderProvider: IQueryBuilderProvider;

  constructor(
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
    @inject('QueryBuilderProvider')
    queryBuilderProvider: IQueryBuilderProvider,
  ) {
    this.studentsRepository = studentsRepository;
    this.teachersRepository = teachersRepository;
    this.queryBuilderProvider = queryBuilderProvider;
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

  public async findAllStudents(query: any): Promise<PaginationAwareObject> {
    const built = this.queryBuilderProvider.buildQuery(query);
    let students = {} as PaginationAwareObject;
    if (query.name) {
      students = await this.studentsRepository.findAllWithPaginationByName(
        query.name,
      );
    } else {
      students = await this.studentsRepository.findAllWithPagination(built);
    }
    return students;
  }

  public async findAllTeachers(query: any): Promise<PaginationAwareObject> {
    const built = this.queryBuilderProvider.buildQuery(query);
    let teachers = {} as PaginationAwareObject;
    if (query.name) {
      teachers = await this.teachersRepository.findAllWithPaginationByName(
        query.name,
      );
    } else {
      teachers = await this.teachersRepository.findAllWithPagination(built);
    }
    return teachers;
  }
}

export default DefaultUserService;
