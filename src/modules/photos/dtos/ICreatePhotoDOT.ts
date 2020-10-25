import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreatePhotoDOT {
  path: string;
  user: User;
}
