import ICreateStudentDTO from '../dtos/ICreateStudentDTO';
import Student from '../infra/typeorm/entities/Student';

interface IStudentsRepository {
  listAll(): Promise<Student[]>;
  findById(id: number): Promise<Student | undefined>;
  findByEnrollment(enrollment: string): Promise<Student | undefined>;
  create(student: ICreateStudentDTO): Promise<Student>;
  delete(id: number): Promise<void>;
  save(student: Student): Promise<Student>;
}

export default IStudentsRepository;
