import ICreateTeacherDTO from '@modules/users/dtos/ICreateTeacherDTO';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import { getRepository, Repository } from 'typeorm';
import Teacher from '../entities/Teacher';
import User from '../entities/User';

class TeachersRepository implements ITeachersRepository {
  private ormRepository: Repository<Teacher>;

  constructor() {
    this.ormRepository = getRepository(Teacher);
  }

  public async listAll(): Promise<Teacher[]> {
    const teachers = await this.ormRepository.find();
    return teachers;
  }

  public async findById(id: number): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne(id);
    return teacher;
  }

  public async findByUser(user: User): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({ where: { user } });
    return teacher;
  }

  public async findByEnrollment(
    enrollment: string,
  ): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({ where: { enrollment } });
    return teacher;
  }

  public async create({
    enrollment,
    user,
  }: ICreateTeacherDTO): Promise<Teacher> {
    const teacher = this.ormRepository.create({
      enrollment,
      user,
    });
    await this.ormRepository.save(teacher);
    return teacher;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(teacher: Teacher): Promise<Teacher> {
    return this.ormRepository.save(teacher);
  }
}

export default TeachersRepository;
