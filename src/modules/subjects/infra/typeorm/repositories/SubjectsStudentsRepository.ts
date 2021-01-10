import ICreateSubjectStudentDOT from '@modules/subjects/dtos/ICreateSubjectStudentDOT';
import ISaveSubjectStudentDOT from '@modules/subjects/dtos/ISaveSubjectStudentDOT';
import ISubjectsStudentsRepository from '@modules/subjects/repositories/ISubjectsStudentsRepository';
import Student from '@modules/users/infra/typeorm/entities/Student';
import { getRepository, Repository } from 'typeorm';
import Subject from '../entities/Subject';
import SubjectStudent from '../entities/SubjectStudent';

class SubjectsStudentsRepository implements ISubjectsStudentsRepository {
  private ormRepository: Repository<SubjectStudent>;

  constructor() {
    this.ormRepository = getRepository(SubjectStudent);
  }

  public async create(
    subject: ICreateSubjectStudentDOT,
  ): Promise<SubjectStudent> {
    return this.ormRepository.save(subject);
  }

  public async findByStudent(
    subject: Subject,
    student: Student,
  ): Promise<SubjectStudent | undefined> {
    const findSubject = await this.ormRepository.findOne({
      where: { student, subject },
    });
    return findSubject;
  }

  public async deleteByStudent(student: Student): Promise<void> {
    await this.ormRepository.delete({
      student,
    });
  }

  public async save(subject: ISaveSubjectStudentDOT): Promise<SubjectStudent> {
    return this.ormRepository.save(subject);
  }
}

export default SubjectsStudentsRepository;
