import ICreateStudentDTO from '@modules/users/dtos/ICreateStudentDTO';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import { getRepository, Repository } from 'typeorm';
import Student from '../entities/Student';

class StudentsRepository implements IStudentsRepository {
  private ormRepository: Repository<Student>;

  constructor() {
    this.ormRepository = getRepository(Student);
  }

  public async listAll(): Promise<Student[]> {
    const students = await this.ormRepository.find();
    return students;
  }

  public async findById(id: number): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne(id);
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