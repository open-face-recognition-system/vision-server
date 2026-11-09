import ICreateSubjectDOT from '@modules/subjects/dtos/ICreateSubjectDOT';
import ISaveSubjectDOT from '@modules/subjects/dtos/ISaveSubjectDOT';
import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import Pagination from '@shared/dtos/Pagination';
import { PageQuery } from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';
import Subject from '../entities/Subject';

class SubjectsRepository implements ISubjectsRepository {
  private ormRepository: Repository<Subject>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Subject);
  }

  public async findAllWithPagination(query: PageQuery): Promise<Pagination> {
    const [data, total] = await this.ormRepository.findAndCount({
      ...query,
      relations: { teacher: { user: true }, recognitionFile: true },
    });
    return { total, data };
  }

  public async findById(id: number): Promise<Subject | undefined> {
    const subject = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: {
        teacher: { user: true },
        recognitionFile: true,
        students: { student: { user: true, photos: true } },
      },
    });
    return subject ?? undefined;
  }

  public async findAllByTeacherId(
    teacherId: number,
    { skip, take }: PageQuery,
  ): Promise<Pagination> {
    const [data, total] = await this.ormRepository
      .createQueryBuilder('subject')
      .innerJoinAndSelect('subject.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { total, data };
  }

  public async create({
    name,
    description,
    course,
    teacher,
  }: ICreateSubjectDOT): Promise<Subject> {
    const subject = this.ormRepository.create({
      name,
      description,
      course,
      teacher,
    });
    await this.ormRepository.save(subject);
    return subject ?? undefined;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(subject: ISaveSubjectDOT): Promise<Subject> {
    return this.ormRepository.save(subject);
  }
}

export default SubjectsRepository;
