import Student from '@modules/users/infra/typeorm/entities/Student';
import PhotoType from '../infra/typeorm/entities/PhotoType';

export default interface ICreatePhotoDOT {
  path: string;
  photoType: PhotoType;
  student: Student;
}
