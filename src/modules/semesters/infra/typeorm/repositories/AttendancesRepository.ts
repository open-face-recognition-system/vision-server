import ICreateAttendanceDTO from '@modules/semesters/dtos/ICreateAttendanceDTO';
import ISaveAttendanceDTO from '@modules/semesters/dtos/ISaveAttendanceDTO';
import IAttendancesRepository from '@modules/semesters/repositories/IAttendancesRepository';
import Pagination from '@shared/dtos/Pagination';
import { getRepository, Repository } from 'typeorm';
import Attendance from '../entities/Attendance';

class AttendancesRepository implements IAttendancesRepository {
  private ormRepository: Repository<Attendance>;

  constructor() {
    this.ormRepository = getRepository(Attendance);
  }

  public async findAllWithPagination(query: any): Promise<Pagination> {
    const attendances = await this.ormRepository.find(query);

    const count = await this.ormRepository.count();
    return {
      total: count,
      data: attendances || [],
    };
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
      relations: ['class', 'student', 'student.user'],
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
