import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Attendence from '../infra/typeorm/entities/Attendence';
import IAttendencesRepository from '../repositories/IAttendencesRepository';
import IClassesRepository from '../repositories/IClassesRepository';

interface IRequest {
  isPresent: boolean;
  classId: number;
  studentId: number;
}

@injectable()
class AttendencesService {
  private attendencesRepository: IAttendencesRepository;

  private studentsRepository: IStudentsRepository;

  private classesRepository: IClassesRepository;

  constructor(
    @inject('AttendencesRepository')
    attendencesRepository: IAttendencesRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('ClassesRepository')
    classesRepository: IClassesRepository,
  ) {
    this.attendencesRepository = attendencesRepository;
    this.studentsRepository = studentsRepository;
    this.classesRepository = classesRepository;
  }

  public async listAttendences(): Promise<PaginationAwareObject> {
    const semesters = await this.attendencesRepository.findAllWithPagination();
    return semesters;
  }

  public async showAttendence(id: number): Promise<Attendence | undefined> {
    const attendence = await this.attendencesRepository.findById(id);

    if (!attendence) {
      throw new AppError('Attendence does not exists');
    }

    return attendence;
  }

  public async createAttendence({
    isPresent,
    classId,
    studentId,
  }: IRequest): Promise<Attendence> {
    const findClass = await this.classesRepository.findById(classId);

    if (!findClass) {
      throw new AppError('Class does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const attendence = await this.attendencesRepository.create({
      isPresent,
      class: findClass,
      student,
    });
    return attendence;
  }

  public async updateAttendence(
    id: number,
    { isPresent, classId, studentId }: IRequest,
  ): Promise<Attendence> {
    const findClass = await this.classesRepository.findById(classId);

    if (!findClass) {
      throw new AppError('Class does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const attendence = await this.attendencesRepository.save({
      id,
      isPresent,
      class: findClass,
      student,
    });
    return attendence;
  }

  public async deleteAttendence(id: number): Promise<void> {
    await this.attendencesRepository.delete(id);
  }
}

export default AttendencesService;
