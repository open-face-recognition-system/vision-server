import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Subject from '../infra/typeorm/entities/Subject';
import SubjectStudent from '../infra/typeorm/entities/SubjectStudent';
import ISubjectsRepository from '../repositories/ISubjectsRepository';
import ISubjectsStudentsRepository from '../repositories/ISubjectsStudentsRepository';

interface IRequest {
  name: string;
  description: string;
  course: string;
  teacherId: number;
}

@injectable()
class SubjectsService {
  private subjectsRepository: ISubjectsRepository;

  private studentsRepository: IStudentsRepository;

  private subjectsStudentsRepository: ISubjectsStudentsRepository;

  private teachersRepository: ITeachersRepository;

  constructor(
    @inject('SubjectsRepository')
    subjectsRepository: ISubjectsRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('SubjectsStudentsRepository')
    subjectsStudentsRepository: ISubjectsStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
  ) {
    this.subjectsRepository = subjectsRepository;
    this.studentsRepository = studentsRepository;
    this.subjectsStudentsRepository = subjectsStudentsRepository;
    this.teachersRepository = teachersRepository;
  }

  public async listSubjects(): Promise<PaginationAwareObject> {
    const subjects = await this.subjectsRepository.findAllWithPagination();
    return subjects;
  }

  public async showSubject(id: number): Promise<Subject | undefined> {
    const subject = await this.subjectsRepository.findById(id);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    return subject;
  }

  public async createSubject({
    name,
    description,
    course,
    teacherId,
  }: IRequest): Promise<Subject> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subject = await this.subjectsRepository.create({
      name,
      description,
      course,
      teacher,
    });
    return subject;
  }

  public async updateSubject(
    id: number,
    { name, description, course, teacherId }: IRequest,
  ): Promise<Subject> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subject = await this.subjectsRepository.save({
      id,
      name,
      description,
      course,
      teacher,
    });

    return subject;
  }

  public async deleteDemester(id: number): Promise<void> {
    await this.subjectsRepository.delete(id);
  }

  public async enrollStudent(
    subjectId: number,
    studentId: number,
  ): Promise<SubjectStudent> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const subjectStudent = await this.subjectsStudentsRepository.save({
      isEnrolled: true,
      subject,
      student,
    });

    return subjectStudent;
  }

  public async unenrollStudent(
    subjectId: number,
    studentId: number,
  ): Promise<void> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    await this.subjectsStudentsRepository.deleteByStudent(student);
  }
}

export default SubjectsService;
