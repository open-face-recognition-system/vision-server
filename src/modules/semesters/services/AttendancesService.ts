import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Attendance from '../infra/typeorm/entities/Attendance';
import IAttendancesRepository from '../repositories/IAttendancesRepository';
import IClassesRepository from '../repositories/IClassesRepository';

interface IRequest {
  isPresent: boolean;
  classId: number;
  studentId: number;
}

@injectable()
class AttendancesService {
  private attendancesRepository: IAttendancesRepository;

  private studentsRepository: IStudentsRepository;

  private classesRepository: IClassesRepository;

  constructor(
    @inject('AttendancesRepository')
    attendancesRepository: IAttendancesRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('ClassesRepository')
    classesRepository: IClassesRepository,
  ) {
    this.attendancesRepository = attendancesRepository;
    this.studentsRepository = studentsRepository;
    this.classesRepository = classesRepository;
  }

  public async listAttendances(query: any): Promise<PaginationAwareObject> {
    const semesters = await this.attendancesRepository.findAllWithPagination(
      query,
    );
    return semesters;
  }

  public async showAttendance(id: number): Promise<Attendance | undefined> {
    const attendance = await this.attendancesRepository.findById(id);

    if (!attendance) {
      throw new AppError('Attendance does not exists');
    }

    return attendance;
  }

  public async createAttendance({
    isPresent,
    classId,
    studentId,
  }: IRequest): Promise<Attendance> {
    const findClass = await this.classesRepository.findById(classId);

    if (!findClass) {
      throw new AppError('Class does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const attendance = await this.attendancesRepository.create({
      isPresent,
      class: findClass,
      student,
    });
    return attendance;
  }

  public async updateAttendance(
    id: number,
    { isPresent, classId, studentId }: IRequest,
  ): Promise<Attendance> {
    const findClass = await this.classesRepository.findById(classId);

    if (!findClass) {
      throw new AppError('Class does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const attendance = await this.attendancesRepository.save({
      id,
      isPresent,
      class: findClass,
      student,
    });
    return attendance;
  }

  public async deleteAttendance(id: number): Promise<void> {
    await this.attendancesRepository.delete(id);
  }
}

export default AttendancesService;
