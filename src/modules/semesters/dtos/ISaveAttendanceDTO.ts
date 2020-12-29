import Student from '@modules/users/infra/typeorm/entities/Student';
import Class from '../infra/typeorm/entities/Class';

export default interface ISaveAttendanceDTO {
  id: number;
  isPresent: boolean;
  class: Class;
  student: Student;
}
