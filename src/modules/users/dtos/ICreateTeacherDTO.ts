import User from '../infra/typeorm/entities/User';

export default interface ICreateTeacherDTO {
  enrollment: string;
  user: User;
}
