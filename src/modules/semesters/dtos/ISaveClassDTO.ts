import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import Semester from '../infra/typeorm/entities/Semester';

export default interface ISaveClassDTO {
  id: number;
  startHour: Date;
  endHour: Date;
  date: Date;
  subject: Subject;
  semester: Semester;
}
