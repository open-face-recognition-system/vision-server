import ICreateClassDTO from '@modules/semesters/dtos/ICreateClassDTO';
import ISaveClassDTO from '@modules/semesters/dtos/ISaveClassDTO';
import IClassesRepository from '@modules/semesters/repositories/IClassesRepository';
import Pagination from '@shared/dtos/Pagination';
import { PageQuery } from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';
import Class from '../entities/Class';

class ClassesRepository implements IClassesRepository {
  private ormRepository: Repository<Class>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Class);
  }

  public async findAllWithPagination(query: PageQuery): Promise<Pagination> {
    const [data, total] = await this.ormRepository.findAndCount({
      ...query,
      relations: { subject: true, semester: true },
    });
    return { total, data };
  }

  public async findById(id: number): Promise<Class | undefined> {
    const findClass = await this.ormRepository.findOne({
      where: { id },
      relations: {
        subject: { recognitionFile: true, students: { student: { user: true } } },
        semester: true,
        attendances: { student: true },
      },
    });
    return findClass ?? undefined;
  }

  public async findAllByTeacherId(teacherId: number): Promise<Class[]> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const classes = await this.ormRepository
      .createQueryBuilder('class')
      .innerJoinAndSelect('class.subject', 'subject')
      .innerJoinAndSelect('subject.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .andWhere('class.date BETWEEN :startDate AND :endDate', {
        startDate: start as any,
        endDate: end as any,
      })
      .orderBy('class.startHour', 'ASC')
      .getMany();
    return classes;
  }

  public async findAllByTeacherIdWithPagination(
    teacherId: number,
    { skip, take }: PageQuery,
  ): Promise<Pagination> {
    const [data, total] = await this.ormRepository
      .createQueryBuilder('class')
      .innerJoinAndSelect('class.subject', 'subject')
      .innerJoinAndSelect('subject.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { total, data };
  }

  public async create({
    startHour,
    endHour,
    date,
    semester,
    subject,
  }: ICreateClassDTO): Promise<Class> {
    const createClass = this.ormRepository.create({
      startHour,
      endHour,
      date,
      semester,
      subject,
    });
    await this.ormRepository.save(createClass);
    return createClass;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(saveClass: ISaveClassDTO): Promise<Class> {
    return this.ormRepository.save(saveClass);
  }
}

export default ClassesRepository;
