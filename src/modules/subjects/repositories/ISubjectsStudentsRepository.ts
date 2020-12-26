import Student from '@modules/users/infra/typeorm/entities/Student';
import ISaveSubjectStudentDOT from '../dtos/ISaveSubjectStudentDOT';
import SubjectStudent from '../infra/typeorm/entities/SubjectStudent';

interface ISubjectsStudentsRepository {
  deleteByStudent(student: Student): Promise<void>;
  save(subject: ISaveSubjectStudentDOT): Promise<SubjectStudent>;
}

export default ISubjectsStudentsRepository;
