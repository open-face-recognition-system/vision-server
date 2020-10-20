import Role from '../infra/typeorm/entities/Role';

export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}
