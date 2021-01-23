import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import Pagination from '@shared/dtos/Pagination';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import ICreateSemesterDTO from '../dtos/ICreateSemesterDTO';
import Semester from '../infra/typeorm/entities/Semester';

import ISemestersRepository from '../repositories/ISemestersRepository';

@injectable()
class SemestersService {
  private semestersRepository: ISemestersRepository;

  private queryBuilderProvider: IQueryBuilderProvider;

  constructor(
    @inject('SemestersRepository')
    semestersRepository: ISemestersRepository,
    @inject('QueryBuilderProvider')
    queryBuilderProvider: IQueryBuilderProvider,
  ) {
    this.semestersRepository = semestersRepository;
    this.queryBuilderProvider = queryBuilderProvider;
  }

  public async listSemesters(query: any): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    const semesters = await this.semestersRepository.findAllWithPagination(
      built,
    );
    return semesters;
  }

  public async showSemester(id: number): Promise<Semester | undefined> {
    const semester = await this.semestersRepository.findById(id);

    if (!semester) {
      throw new AppError('Semester does not exists');
    }

    return semester;
  }

  public async createSemester({
    startDate,
    endDate,
  }: ICreateSemesterDTO): Promise<Semester> {
    const semester = await this.semestersRepository.create({
      startDate,
      endDate,
    });
    return semester;
  }

  public async updateSemester(
    id: number,
    { startDate, endDate }: ICreateSemesterDTO,
  ): Promise<Semester> {
    const semester = await this.semestersRepository.save({
      id,
      startDate,
      endDate,
    });
    return semester;
  }

  public async deleteSemester(id: number): Promise<void> {
    await this.semestersRepository.delete(id);
  }
}

export default SemestersService;
