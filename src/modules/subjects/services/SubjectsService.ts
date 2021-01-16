import Student from '@modules/users/infra/typeorm/entities/Student';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import Pagination from '@shared/dtos/Pagination';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Subject from '../infra/typeorm/entities/Subject';
import ISubjectsRepository from '../repositories/ISubjectsRepository';
import ISubjectsStudentsRepository from '../repositories/ISubjectsStudentsRepository';

interface IRequest {
  name: string;
  description: string;
  course: string;
  teacherId: number;
}

@injectable()
class SubjectsService {
  private subjectsRepository: ISubjectsRepository;

  private studentsRepository: IStudentsRepository;

  private subjectsStudentsRepository: ISubjectsStudentsRepository;

  private teachersRepository: ITeachersRepository;

  private queryBuilderProvider: IQueryBuilderProvider;

  constructor(
    @inject('SubjectsRepository')
    subjectsRepository: ISubjectsRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('SubjectsStudentsRepository')
    subjectsStudentsRepository: ISubjectsStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
    @inject('QueryBuilderProvider')
    queryBuilderProvider: IQueryBuilderProvider,
  ) {
    this.subjectsRepository = subjectsRepository;
    this.studentsRepository = studentsRepository;
    this.subjectsStudentsRepository = subjectsStudentsRepository;
    this.teachersRepository = teachersRepository;
    this.queryBuilderProvider = queryBuilderProvider;
  }

  public async listSubjects(query: any): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    const subjects = await this.subjectsRepository.findAllWithPagination(built);
    return subjects;
  }

  public async showSubject(id: number): Promise<Subject | undefined> {
    const subject = await this.subjectsRepository.findById(id);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    return subject;
  }

  public async createSubject({
    name,
    description,
    course,
    teacherId,
  }: IRequest): Promise<Subject> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subject = await this.subjectsRepository.create({
      name,
      description,
      course,
      teacher,
    });
    return subject;
  }

  public async updateSubject(
    id: number,
    { name, description, course, teacherId }: IRequest,
  ): Promise<Subject> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subject = await this.subjectsRepository.save({
      id,
      name,
      description,
      course,
      teacher,
    });

    return subject;
  }

  public async deleteSubject(id: number): Promise<void> {
    await this.subjectsRepository.delete(id);
  }

  public async enrollStudent(
    subjectId: number,
    studentId: number,
  ): Promise<Student> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const studentAlreadyEnrolled = await this.subjectsStudentsRepository.findByStudent(
      subject,
      student,
    );

    if (studentAlreadyEnrolled && studentAlreadyEnrolled.isEnrolled) {
      throw new AppError('Student already enrolled');
    }

    if (studentAlreadyEnrolled && !studentAlreadyEnrolled.isEnrolled) {
      await this.subjectsStudentsRepository.save({
        id: studentAlreadyEnrolled.id,
        isEnrolled: true,
        subject,
        student,
      });
    } else {
      await this.subjectsStudentsRepository.create({
        isEnrolled: true,
        subject,
        student,
      });
    }

    return student;
  }

  public async unenrollStudent(
    subjectId: number,
    studentId: number,
  ): Promise<void> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const studentAlreadyEnrolled = await this.subjectsStudentsRepository.findByStudent(
      subject,
      student,
    );

    if (!studentAlreadyEnrolled) {
      throw new AppError('Student does not enrolled on this subject');
    }

    await this.subjectsStudentsRepository.save({
      id: studentAlreadyEnrolled.id,
      isEnrolled: false,
      subject,
      student,
    });
  }

  public async listAllByTeacher(teacherId: number): Promise<Subject[]> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const classes = await this.subjectsRepository.findAllByTeacherId(teacherId);

    return classes;
  }
}

export default SubjectsService;
