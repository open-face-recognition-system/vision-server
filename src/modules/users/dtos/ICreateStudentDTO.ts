import User from '../infra/typeorm/entities/User';

export default interface ICreateStudentDTO {
  enrollment: string;
  user: User;
}
