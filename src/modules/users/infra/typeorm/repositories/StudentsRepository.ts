import ICreateStudentDTO from '@modules/users/dtos/ICreateStudentDTO';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';
import Pagination from '@shared/dtos/Pagination';
import { PageQuery } from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import Student from '../entities/Student';
import User from '../entities/User';

class StudentsRepository implements IStudentsRepository {
  private ormRepository: Repository<Student>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Student);
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
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.user', 'user')
      .where('user.name ILIKE :name', { name: `%${name}%` })
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { total, data };
  }

  public async findAll(): Promise<Student[]> {
    const students = await this.ormRepository.find({
      relations: { user: true, photos: true },
    });
    return students;
  }

  public async findById(id: number): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({
      where: { id },
      relations: { user: true, photos: true },
    });
    return student ?? undefined;
  }

  public async findByUser(user: User): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({ where: { user: { id: user.id } } });
    return student ?? undefined;
  }

  public async findByEnrollment(
    enrollment: string,
  ): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({ where: { enrollment } });
    return student ?? undefined;
  }

  public async create({
    enrollment,
    user,
  }: ICreateStudentDTO): Promise<Student> {
    const student = this.ormRepository.create({
      enrollment,
      user,
      signedTerm: true,
    });
    await this.ormRepository.save(student);
    return student ?? undefined;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(student: Student): Promise<Student> {
    return this.ormRepository.save(student);
  }
}

export default StudentsRepository;
