import Pagination from '@shared/dtos/Pagination';
import ICreateClassDTO from '../dtos/ICreateClassDTO';
import ISaveClassDTO from '../dtos/ISaveClassDTO';

import Class from '../infra/typeorm/entities/Class';

interface IClassesRepository {
  findAllWithPagination(query: any): Promise<Pagination>;
  findAllByTeacherId(teacherId: number): Promise<Class[]>;
  findById(id: number): Promise<Class | undefined>;
  create(createClass: ICreateClassDTO): Promise<Class>;
  delete(id: number): Promise<void>;
  save(saveClass: ISaveClassDTO): Promise<Class>;
}

export default IClassesRepository;
