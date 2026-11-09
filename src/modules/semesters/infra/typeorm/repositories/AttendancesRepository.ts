import ICreateAttendanceDTO from '@modules/semesters/dtos/ICreateAttendanceDTO';
import ISaveAttendanceDTO from '@modules/semesters/dtos/ISaveAttendanceDTO';
import IAttendancesRepository from '@modules/semesters/repositories/IAttendancesRepository';
import Pagination from '@shared/dtos/Pagination';
import { PageQuery } from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';
import Attendance from '../entities/Attendance';

class AttendancesRepository implements IAttendancesRepository {
  private ormRepository: Repository<Attendance>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Attendance);
  }

  public async findAllWithPagination(query: PageQuery): Promise<Pagination> {
    const [data, total] = await this.ormRepository.findAndCount(query);
    return { total, data };
  }

  public async findAllByClassId(classId: number): Promise<Attendance[]> {
    const attendances = await this.ormRepository
      .createQueryBuilder('attendance')
      .innerJoinAndSelect('attendance.student', 'student')
      .innerJoinAndSelect('student.user', 'user')
      .innerJoinAndSelect('attendance.class', 'class')
      .where('class.id = :classId', { classId })
      .getMany();

    return attendances;
  }

  public async findById(id: number): Promise<Attendance | undefined> {
    const attendance = await this.ormRepository.findOne({
      where: { id },
      relations: { class: true, student: { user: true } },
    });
    return attendance ?? undefined;
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
    return attendance ?? undefined;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(attendance: ISaveAttendanceDTO): Promise<Attendance> {
    return this.ormRepository.save(attendance);
  }
}

export default AttendancesRepository;
