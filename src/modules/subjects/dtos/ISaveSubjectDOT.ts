import Teacher from '@modules/users/infra/typeorm/entities/Teacher';

export default interface ISaveSubjectDOT {
  id: number;
  name: string;
  description: string;
  course: string;
  teacher: Teacher;
}
