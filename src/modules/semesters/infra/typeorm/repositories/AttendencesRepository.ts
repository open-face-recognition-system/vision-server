import ICreateAttendenceDTO from '@modules/semesters/dtos/ICreateAttendenceDTO';
import ISaveAttendenceDTO from '@modules/semesters/dtos/ISaveAttendenceDTO';
import IAttendencesRepository from '@modules/semesters/repositories/IAttendencesRepository';
import { getRepository, Repository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Attendence from '../entities/Attendence';

class AttendencesRepository implements IAttendencesRepository {
  private ormRepository: Repository<Attendence>;

  constructor() {
    this.ormRepository = getRepository(Attendence);
  }

  public async findAllWithPagination(): Promise<PaginationAwareObject> {
    const classes = await this.ormRepository
      .createQueryBuilder('attendences')
      .paginate();

    return classes;
  }

  public async findById(id: number): Promise<Attendence | undefined> {
    const attendence = await this.ormRepository.findOne({
      where: { id },
    });
    return attendence;
  }

  public async create({
    isPresent,
    class: attendenceClass,
    student,
  }: ICreateAttendenceDTO): Promise<Attendence> {
    const attendence = this.ormRepository.create({
      isPresent,
      class: attendenceClass,
      student,
    });
    await this.ormRepository.save(attendence);
    return attendence;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(attendence: ISaveAttendenceDTO): Promise<Attendence> {
    return this.ormRepository.save(attendence);
  }
}

export default AttendencesRepository;
