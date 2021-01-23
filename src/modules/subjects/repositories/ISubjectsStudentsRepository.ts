import Student from '@modules/users/infra/typeorm/entities/Student';
import ICreateSubjectStudentDOT from '../dtos/ICreateSubjectStudentDOT';
import ISaveSubjectStudentDOT from '../dtos/ISaveSubjectStudentDOT';
import Subject from '../infra/typeorm/entities/Subject';
import SubjectStudent from '../infra/typeorm/entities/SubjectStudent';

interface ISubjectsStudentsRepository {
  findByStudent(
    subject: Subject,
    student: Student,
  ): Promise<SubjectStudent | undefined>;
  create(subjectStudent: ICreateSubjectStudentDOT): Promise<SubjectStudent>;
  deleteByStudent(student: Student): Promise<void>;
  save(subjectStudent: ISaveSubjectStudentDOT): Promise<SubjectStudent>;
}

export default ISubjectsStudentsRepository;
