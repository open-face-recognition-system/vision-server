import Student from '@modules/users/infra/typeorm/entities/Student';
import Class from '../infra/typeorm/entities/Class';

export default interface ICreateAttendanceDTO {
  isPresent: boolean;
  class: Class;
  student: Student;
}
