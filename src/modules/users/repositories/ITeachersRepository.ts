import ICreateTeacherDTO from '../dtos/ICreateTeacherDTO';
import Teacher from '../infra/typeorm/entities/Teacher';

export default interface ITeachersRepository {
  listAll(): Promise<Teacher[]>;
  findById(id: number): Promise<Teacher | undefined>;
  findByEnrollment(enrollment: string): Promise<Teacher | undefined>;
  create(teacher: ICreateTeacherDTO): Promise<Teacher>;
  delete(id: number): Promise<void>;
  save(teacher: Teacher): Promise<Teacher>;
}