import ICreateSemesterDTO from '@modules/semesters/dtos/ICreateSemesterDTO';
import ISaveSemesterDTO from '@modules/semesters/dtos/ISaveSemesterDTO';
import ISemestersRepository from '@modules/semesters/repositories/ISemestersRepository';
import { getRepository, Repository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Semester from '../entities/Semester';

class SemestersRepository implements ISemestersRepository {
  private ormRepository: Repository<Semester>;

  constructor() {
    this.ormRepository = getRepository(Semester);
  }

  public async findAllWithPagination(): Promise<PaginationAwareObject> {
    const semesters = await this.ormRepository
      .createQueryBuilder('semester')
      .paginate();

    return semesters;
  }

  public async findById(id: number): Promise<Semester | undefined> {
    const semester = await this.ormRepository.findOne({
      where: { id },
    });
    return semester;
  }

  public async create({
    startDate,
    endDate,
  }: ICreateSemesterDTO): Promise<Semester> {
    const semester = this.ormRepository.create({ startDate, endDate });
    await this.ormRepository.save(semester);
    return semester;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(semester: ISaveSemesterDTO): Promise<Semester> {
    return this.ormRepository.save(semester);
  }
}

export default SemestersRepository;
