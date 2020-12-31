import ICreateClassDTO from '@modules/semesters/dtos/ICreateClassDTO';
import ISaveClassDTO from '@modules/semesters/dtos/ISaveClassDTO';
import IClassesRepository from '@modules/semesters/repositories/IClassesRepository';
import { getRepository, Repository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Class from '../entities/Class';

class ClassesRepository implements IClassesRepository {
  private ormRepository: Repository<Class>;

  constructor() {
    this.ormRepository = getRepository(Class);
  }

  public async findAllWithPagination(
    query: any,
  ): Promise<PaginationAwareObject> {
    const classes = await this.ormRepository
      .createQueryBuilder('classes')
      .where(query.where)
      .paginate();

    return classes;
  }

  public async findById(id: number): Promise<Class | undefined> {
    const findClass = await this.ormRepository.findOne({
      where: { id },
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
