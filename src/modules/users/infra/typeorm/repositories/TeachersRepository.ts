import ICreateTeacherDTO from '@modules/users/dtos/ICreateTeacherDTO';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import Pagination from '@shared/dtos/Pagination';
import { PageQuery } from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';
import Teacher from '../entities/Teacher';
import User from '../entities/User';

class TeachersRepository implements ITeachersRepository {
  private ormRepository: Repository<Teacher>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Teacher);
  }

  public async findAllWithPagination(query: PageQuery): Promise<Pagination> {
    const [data, total] = await this.ormRepository.findAndCount({
      ...query,
      relations: { user: true },
    });
    return { total, data };
  }

  public async findAllWithPaginationByName(
    name: string,
    { skip, take }: PageQuery,
  ): Promise<Pagination> {
    const [data, total] = await this.ormRepository
      .createQueryBuilder('teacher')
      .innerJoinAndSelect('teacher.user', 'user')
      .where('user.name ILIKE :name', { name: `%${name}%` })
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { total, data };
  }

  public async listAll(query: any): Promise<Teacher[]> {
    const teachers = await this.ormRepository.find(query);
    return teachers;
  }

  public async findById(id: number): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    return teacher ?? undefined;
  }

  public async findByUser(user: User): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({ where: { user: { id: user.id } } });
    return teacher ?? undefined;
  }

  public async findByEnrollment(
    enrollment: string,
  ): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({ where: { enrollment } });
    return teacher ?? undefined;
  }

  public async create({
    enrollment,
    user,
  }: ICreateTeacherDTO): Promise<Teacher> {
    const teacher = this.ormRepository.create({
      enrollment,
      user,
    });
    await this.ormRepository.save(teacher);
    return teacher ?? undefined;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(teacher: Teacher): Promise<Teacher> {
    return this.ormRepository.save(teacher);
  }
}

export default TeachersRepository;
