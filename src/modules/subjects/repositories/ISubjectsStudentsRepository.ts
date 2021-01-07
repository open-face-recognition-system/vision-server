import Student from '@modules/users/infra/typeorm/entities/Student';
import ICreateSubjectStudentDOT from '../dtos/ICreateSubjectStudentDOT';
import ISaveSubjectStudentDOT from '../dtos/ISaveSubjectStudentDOT';
import SubjectStudent from '../infra/typeorm/entities/SubjectStudent';

interface ISubjectsStudentsRepository {
  deleteByStudent(student: Student): Promise<void>;
  findByStudent(student: Student): Promise<SubjectStudent | undefined>;
  create(subject: ICreateSubjectStudentDOT): Promise<SubjectStudent>;
  save(subject: ISaveSubjectStudentDOT): Promise<SubjectStudent>;
}

export default ISubjectsStudentsRepository;
