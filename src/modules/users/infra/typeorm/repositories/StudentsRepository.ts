import ICreateStudentDTO from '@modules/users/dtos/ICreateStudentDTO';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import { getRepository, Repository } from 'typeorm';
import Pagination from '@shared/dtos/Pagination';
import Student from '../entities/Student';
import User from '../entities/User';

class StudentsRepository implements IStudentsRepository {
  private ormRepository: Repository<Student>;

  constructor() {
    this.ormRepository = getRepository(Student);
  }

  public async findAllWithPagination(query: any): Promise<Pagination> {
    const students = await this.ormRepository.find({
      ...query,
      relations: ['user'],
    });

    const count = await this.ormRepository.count();
    return {
      total: count,
      data: students || [],
    };
  }

  public async findAllWithPaginationByName(name: string): Promise<Pagination> {
    const students = await this.ormRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.user', 'user')
      .where('user.name ILIKE :name', { name: `%${name}%` })
      .paginate();
    return students;
  }

  public async findAll(): Promise<Student[]> {
    const students = await this.ormRepository.find({
      relations: ['user', 'photos'],
    });
    return students;
  }

  public async findById(id: number): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({
      where: { id },
      relations: ['user', 'photos'],
    });
    return student;
  }

  public async findByUser(user: User): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({ where: { user } });
    return student;
  }

  public async findByEnrollment(
    enrollment: string,
  ): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({ where: { enrollment } });
    return student;
  }

  public async create({
    enrollment,
    user,
  }: ICreateStudentDTO): Promise<Student> {
    const student = this.ormRepository.create({
      enrollment,
      user,
      signedTerm: true,
    });
    await this.ormRepository.save(student);
    return student;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(student: Student): Promise<Student> {
    return this.ormRepository.save(student);
  }
}

export default StudentsRepository;
