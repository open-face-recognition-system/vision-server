import ICreateSubjectDOT from '@modules/subjects/dtos/ICreateSubjectDOT';
import ISaveSubjectDOT from '@modules/subjects/dtos/ISaveSubjectDOT';
import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import Pagination from '@shared/dtos/Pagination';
import { getRepository, Repository } from 'typeorm';
import Subject from '../entities/Subject';

class SubjectsRepository implements ISubjectsRepository {
  private ormRepository: Repository<Subject>;

  constructor() {
    this.ormRepository = getRepository(Subject);
  }

  public async findAllWithPagination(query: any): Promise<Pagination> {
    const subjects = await this.ormRepository.find({
      ...query,
      relations: ['teacher', 'teacher.user', 'recognitionFile'],
    });

    const count = await this.ormRepository.count();
    return {
      total: count,
      data: subjects || [],
    };
  }

  public async findById(id: number): Promise<Subject | undefined> {
    const subject = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: [
        'teacher',
        'teacher.user',
        'students',
        'recognitionFile',
        'students.student',
        'students.student.user',
        'students.student.photos',
      ],
    });
    return subject;
  }

  public async findAllByTeacherId(teacherId: number): Promise<Subject[]> {
    const subjects = await this.ormRepository
      .createQueryBuilder('subject')
      .innerJoinAndSelect('subject.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .getMany();

    return subjects;
  }

  public async create({
    name,
    description,
    course,
    teacher,
  }: ICreateSubjectDOT): Promise<Subject> {
    const subject = this.ormRepository.create({
      name,
      description,
      course,
      teacher,
    });
    await this.ormRepository.save(subject);
    return subject;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(subject: ISaveSubjectDOT): Promise<Subject> {
    return this.ormRepository.save(subject);
  }
}

export default SubjectsRepository;
