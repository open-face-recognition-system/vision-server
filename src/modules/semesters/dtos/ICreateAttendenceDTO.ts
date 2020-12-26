import Student from '@modules/users/infra/typeorm/entities/Student';
import Class from '../infra/typeorm/entities/Class';

export default interface ICreateAttendenceDTO {
  isPresent: boolean;
  class: Class;
  student: Student;
}
