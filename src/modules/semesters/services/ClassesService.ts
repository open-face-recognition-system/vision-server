import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import Pagination from '@shared/dtos/Pagination';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Class from '../infra/typeorm/entities/Class';
import IAttendancesRepository from '../repositories/IAttendancesRepository';
import IClassesRepository from '../repositories/IClassesRepository';
import ISemestersRepository from '../repositories/ISemestersRepository';

interface IRequest {
  startHour: Date;
  endHour: Date;
  date: Date;
  subjectId: number;
  semesterId: number;
}

@injectable()
class ClassesService {
  private classesRepository: IClassesRepository;

  private subjectsRepository: ISubjectsRepository;

  private semestersRepository: ISemestersRepository;

  private teachersRepository: ITeachersRepository;

  private queryBuilderProvider: IQueryBuilderProvider;

  private attendancesRepository: IAttendancesRepository;

  constructor(
    @inject('ClassesRepository')
    classesRepository: IClassesRepository,
    @inject('SubjectsRepository')
    subjectsRepository: ISubjectsRepository,
    @inject('SemestersRepository')
    semestersRepository: ISemestersRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
    @inject('AttendancesRepository')
    attendancesRepository: IAttendancesRepository,
    @inject('QueryBuilderProvider')
    queryBuilderProvider: IQueryBuilderProvider,
  ) {
    this.classesRepository = classesRepository;
    this.subjectsRepository = subjectsRepository;
    this.semestersRepository = semestersRepository;
    this.attendancesRepository = attendancesRepository;
    this.teachersRepository = teachersRepository;
    this.queryBuilderProvider = queryBuilderProvider;
  }

  public async listClasses(query: any): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    const classes = await this.classesRepository.findAllWithPagination(built);
    return classes;
  }

  public async showClass(id: number): Promise<Class | undefined> {
    const findClass = await this.classesRepository.findById(id);

    if (!findClass) {
      throw new AppError('Class does not exists');
    }

    return findClass;
  }

  public async createClass({
    startHour,
    endHour,
    date,
    semesterId,
    subjectId,
  }: IRequest): Promise<Class> {
    const semester = await this.semestersRepository.findById(semesterId);

    if (!semester) {
      throw new AppError('Class does not exists');
    }

    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const { students } = subject;

    const newClass = await this.classesRepository.create({
      startHour,
      endHour,
      date,
      semester,
      subject,
    });

    const subjectStudentsPromise = students.map(async studentSubject => {
      const { student } = studentSubject;
      await this.attendancesRepository.create({
        isPresent: false,
        class: newClass,
        student,
      });
    });

    await Promise.all(subjectStudentsPromise);

    return newClass;
  }

  public async updateClass(
    id: number,
    { startHour, endHour, date, semesterId, subjectId }: IRequest,
  ): Promise<Class> {
    const semester = await this.semestersRepository.findById(semesterId);

    if (!semester) {
      throw new AppError('Class does not exists');
    }

    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const updateClass = await this.classesRepository.save({
      id,
      startHour,
      endHour,
      date,
      semester,
      subject,
    });
    return updateClass;
  }

  public async deleteClass(id: number): Promise<void> {
    await this.classesRepository.delete(id);
  }

  public async listAllByTeacherForMobile(teacherId: number): Promise<Class[]> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const classes = await this.classesRepository.findAllByTeacherId(teacherId);

    return classes;
  }

  public async listAllByTeacher(
    teacherId: number,
    query: any,
  ): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const classes = await this.classesRepository.findAllByTeacherIdWithPagination(
      teacherId,
      built,
    );

    return classes;
  }
}

export default ClassesService;
