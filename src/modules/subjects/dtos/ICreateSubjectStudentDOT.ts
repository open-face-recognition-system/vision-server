import Student from '@modules/users/infra/typeorm/entities/Student';
import Subject from '../infra/typeorm/entities/Subject';

export default interface ICreateSubjectStudentDOT {
  isEnrolled: boolean;
  subject: Subject;
  student: Student;
}
