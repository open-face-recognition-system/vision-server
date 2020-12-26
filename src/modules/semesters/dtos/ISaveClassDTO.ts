import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import Semester from '../infra/typeorm/entities/Semester';

export default interface ISaveClassDTO {
  id: number;
  startDate: Date;
  endDate: Date;
  date: Date;
  subject: Subject;
  semester: Semester;
}
