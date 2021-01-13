import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import Pagination from '@shared/dtos/Pagination';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import Student from '../infra/typeorm/entities/Student';
import Teacher from '../infra/typeorm/entities/Teacher';
import IStudentsRepository from '../repositories/IStudentsRepository';
import ITeachersRepository from '../repositories/ITeachersRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface UpdateDefaultUser {
  name: string;
  email: string;
}

@injectable()
class DefaultUserService {
  private studentsRepository: IStudentsRepository;

  private teachersRepository: ITeachersRepository;

  private queryBuilderProvider: IQueryBuilderProvider;

  private usersRepository: IUsersRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
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
    this.usersRepository = usersRepository;
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

  public async findAllStudents(query: any): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    let students = {} as Pagination;
    if (query.name) {
      students = await this.studentsRepository.findAllWithPaginationByName(
        query.name,
      );
    } else {
      students = await this.studentsRepository.findAllWithPagination(built);
    }
    return students;
  }

  public async findAllTeachers(query: any): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    let teachers = {} as Pagination;
    if (query.name) {
      teachers = await this.teachersRepository.findAllWithPaginationByName(
        query.name,
      );
    } else {
      teachers = await this.teachersRepository.findAllWithPagination(built);
    }
    return teachers;
  }

  public async updateTeacher(id: number, { name, email }: UpdateDefaultUser) {
    const teacher = await this.teachersRepository.findById(id);

    if (!teacher) {
      throw new AppError('Teacher not found');
    }

    const { user } = teacher;

    user.email = email;
    user.name = name;

    return this.usersRepository.save(user);
  }

  public async updateStudent(id: number, { name, email }: UpdateDefaultUser) {
    const student = await this.studentsRepository.findById(id);

    if (!student) {
      throw new AppError('Student not found');
    }

    const { user } = student;

    user.email = email;
    user.name = name;

    return this.usersRepository.save(user);
  }

  public async deleteUser(id: number) {
    await this.usersRepository.delete(id);
  }
}

export default DefaultUserService;
