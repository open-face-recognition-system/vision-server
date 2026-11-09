import ICreateSemesterDTO from '@modules/semesters/dtos/ICreateSemesterDTO';
import ISaveSemesterDTO from '@modules/semesters/dtos/ISaveSemesterDTO';
import ISemestersRepository from '@modules/semesters/repositories/ISemestersRepository';
import Pagination from '@shared/dtos/Pagination';
import { PageQuery } from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';
import Semester from '../entities/Semester';

class SemestersRepository implements ISemestersRepository {
  private ormRepository: Repository<Semester>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Semester);
  }

  public async findAllWithPagination(query: PageQuery): Promise<Pagination> {
    const [data, total] = await this.ormRepository.findAndCount(query);
    return { total, data };
  }

  public async findById(id: number): Promise<Semester | undefined> {
    const semester = await this.ormRepository.findOne({
      where: { id },
    });
    return semester ?? undefined;
  }

  public async create({
    startDate,
    endDate,
  }: ICreateSemesterDTO): Promise<Semester> {
    const semester = this.ormRepository.create({ startDate, endDate });
    await this.ormRepository.save(semester);
    return semester ?? undefined;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(semester: ISaveSemesterDTO): Promise<Semester> {
    return this.ormRepository.save(semester);
  }
}

export default SemestersRepository;
