import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';
import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: number): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async create(user: ICreateUserDTO): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, { id: Math.random() }, user);

    this.users.push(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }
}

export default FakeUsersRepository;
