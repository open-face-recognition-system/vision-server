import Student from '@modules/users/infra/typeorm/entities/Student';
import Subject from '../infra/typeorm/entities/Subject';

export default interface ISaveSubjectStudentDOT {
  id: number;
  isEnrolled: boolean;
  subject: Subject;
  student: Student;
}
