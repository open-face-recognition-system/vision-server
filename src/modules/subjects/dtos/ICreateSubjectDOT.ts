import Teacher from '@modules/users/infra/typeorm/entities/Teacher';

export default interface ICreateSubjectDOT {
  name: string;
  description: string;
  course: string;
  teacher: Teacher;
}
