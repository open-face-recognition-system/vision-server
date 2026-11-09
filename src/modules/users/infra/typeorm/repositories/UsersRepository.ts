import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = dataSource.getRepository(User);
  }

  public async findById(id: number): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  public async create({
    name,
    email,
    password,
    role,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password, role });
    await this.ormRepository.save(user);
    return user ?? undefined;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UsersRepository;
