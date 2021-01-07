import ICreateClassDTO from '@modules/semesters/dtos/ICreateClassDTO';
import ISaveClassDTO from '@modules/semesters/dtos/ISaveClassDTO';
import IClassesRepository from '@modules/semesters/repositories/IClassesRepository';
import Pagination from '@shared/dtos/Pagination';
import { getRepository, Repository } from 'typeorm';
import Class from '../entities/Class';

class ClassesRepository implements IClassesRepository {
  private ormRepository: Repository<Class>;

  constructor() {
    this.ormRepository = getRepository(Class);
  }

  public async findAllWithPagination(query: any): Promise<Pagination> {
    const classes = await this.ormRepository.find({
      ...query,
      relations: ['subject', 'semester'],
    });

    const count = await this.ormRepository.count();
    return {
      total: count,
      data: classes || [],
    };
  }

  public async findById(id: number): Promise<Class | undefined> {
    const findClass = await this.ormRepository.findOne({
      where: { id },
      relations: [
        'subject',
        'semester',
        'attendances',
        'attendances.student',
        'attendances.student.user',
      ],
    });
    return findClass;
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
