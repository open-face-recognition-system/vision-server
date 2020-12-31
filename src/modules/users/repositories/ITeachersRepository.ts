import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import ICreateTeacherDTO from '../dtos/ICreateTeacherDTO';
import Teacher from '../infra/typeorm/entities/Teacher';
import User from '../infra/typeorm/entities/User';

export default interface ITeachersRepository {
  findAllWithPagination(): Promise<PaginationAwareObject>;
  listAll(): Promise<Teacher[]>;
  findById(id: number): Promise<Teacher | undefined>;
  findByUser(user: User): Promise<Teacher | undefined>;
  findByEnrollment(enrollment: string): Promise<Teacher | undefined>;
  create(teacher: ICreateTeacherDTO): Promise<Teacher>;
  delete(id: number): Promise<void>;
  save(teacher: Teacher): Promise<Teacher>;
}
