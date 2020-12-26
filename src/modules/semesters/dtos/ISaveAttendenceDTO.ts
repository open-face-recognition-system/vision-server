import Student from '@modules/users/infra/typeorm/entities/Student';
import Class from '../infra/typeorm/entities/Class';

export default interface ISaveAttendenceDTO {
  id: number;
  isPresent: boolean;
  class: Class;
  student: Student;
}
