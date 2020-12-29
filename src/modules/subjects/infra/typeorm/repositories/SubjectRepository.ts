import ICreateSubjectDOT from '@modules/subjects/dtos/ICreateSubjectDOT';
import ISaveSubjectDOT from '@modules/subjects/dtos/ISaveSubjectDOT';
import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import { getRepository, Repository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import Subject from '../entities/Subject';

class SubjectsRepository implements ISubjectsRepository {
  private ormRepository: Repository<Subject>;

  constructor() {
    this.ormRepository = getRepository(Subject);
  }

  public async findAllWithPagination(): Promise<PaginationAwareObject> {
    const semesters = await this.ormRepository
      .createQueryBuilder('subject')
      .innerJoinAndSelect('subject.teacher', 'teacher')
      .innerJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('subject.recognitionFile', 'recognitionFile')
      .paginate();

    return semesters;
  }

  public async findById(id: number): Promise<Subject | undefined> {
    const semester = await this.ormRepository.findOne({
      where: { id },
      relations: [
        'teacher',
        'teacher.user',
        'students',
        'recognitionFile',
        'students.student',
        'students.student.user',
      ],
    });
    return semester;
  }

  public async create({
    name,
    description,
    course,
    teacher,
  }: ICreateSubjectDOT): Promise<Subject> {
    const semester = this.ormRepository.create({
      name,
      description,
      course,
      teacher,
    });
    await this.ormRepository.save(semester);
    return semester;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(subject: ISaveSubjectDOT): Promise<Subject> {
    return this.ormRepository.save(subject);
  }
}

export default SubjectsRepository;
