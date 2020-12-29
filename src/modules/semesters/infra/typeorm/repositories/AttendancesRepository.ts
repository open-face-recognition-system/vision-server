import ICreateAttendanceDTO from '@modules/semesters/dtos/ICreateAttendanceDTO';
import ISaveAttendanceDTO from '@modules/semesters/dtos/ISaveAttendanceDTO';
import IAttendancesRepository from '@modules/semesters/repositories/IAttendancesRepository';
import { getRepository, Repository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Attendance from '../entities/Attendance';

class AttendancesRepository implements IAttendancesRepository {
  private ormRepository: Repository<Attendance>;

  constructor() {
    this.ormRepository = getRepository(Attendance);
  }

  public async findAllWithPagination(): Promise<PaginationAwareObject> {
    const classes = await this.ormRepository
      .createQueryBuilder('attendances')
      .paginate();

    return classes;
  }

  public async findById(id: number): Promise<Attendance | undefined> {
    const attendance = await this.ormRepository.findOne({
      where: { id },
    });
    return attendance;
  }

  public async create({
    isPresent,
    class: attendanceClass,
    student,
  }: ICreateAttendanceDTO): Promise<Attendance> {
    const attendance = this.ormRepository.create({
      isPresent,
      class: attendanceClass,
      student,
    });
    await this.ormRepository.save(attendance);
    return attendance;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(attendance: ISaveAttendanceDTO): Promise<Attendance> {
    return this.ormRepository.save(attendance);
  }
}

export default AttendancesRepository;
