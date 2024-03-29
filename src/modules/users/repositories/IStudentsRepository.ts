import Pagination from '@shared/dtos/Pagination';
import ICreateStudentDTO from '../dtos/ICreateStudentDTO';
import Student from '../infra/typeorm/entities/Student';
import User from '../infra/typeorm/entities/User';

interface IStudentsRepository {
  findAllWithPagination(query: any): Promise<Pagination>;
  findAllWithPaginationByName(name: string): Promise<Pagination>;
  findById(id: number): Promise<Student | undefined>;
  findByUser(user: User): Promise<Student | undefined>;
  findByEnrollment(enrollment: string): Promise<Student | undefined>;
  create(student: ICreateStudentDTO): Promise<Student>;
  delete(id: number): Promise<void>;
  save(student: Student): Promise<Student>;
}

export default IStudentsRepository;
