import ISaveSubjectStudentDOT from '@modules/subjects/dtos/ISaveSubjectStudentDOT';
import ISubjectsStudentsRepository from '@modules/subjects/repositories/ISubjectsStudentsRepository';
import Student from '@modules/users/infra/typeorm/entities/Student';
import { getRepository, Repository } from 'typeorm';
import SubjectStudent from '../entities/SubjectStudent';

class SubjectsStudentsRepository implements ISubjectsStudentsRepository {
  private ormRepository: Repository<SubjectStudent>;

  constructor() {
    this.ormRepository = getRepository(SubjectStudent);
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
