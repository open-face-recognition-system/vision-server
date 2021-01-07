import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import Pagination from '@shared/dtos/Pagination';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Class from '../infra/typeorm/entities/Class';
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

  private queryBuilderProvider: IQueryBuilderProvider;

  constructor(
    @inject('ClassesRepository')
    classesRepository: IClassesRepository,
    @inject('SubjectsRepository')
    subjectsRepository: ISubjectsRepository,
    @inject('SemestersRepository')
    semestersRepository: ISemestersRepository,
    @inject('QueryBuilderProvider')
    queryBuilderProvider: IQueryBuilderProvider,
  ) {
    this.classesRepository = classesRepository;
    this.subjectsRepository = subjectsRepository;
    this.semestersRepository = semestersRepository;
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

    const newClass = await this.classesRepository.create({
      startHour,
      endHour,
      date,
      semester,
      subject,
    });
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
}

export default ClassesService;
