import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import ICreateClassDTO from '../dtos/ICreateClassDTO';
import ISaveClassDTO from '../dtos/ISaveClassDTO';

import Class from '../infra/typeorm/entities/Class';

interface IClassesRepository {
  findAllWithPagination(): Promise<PaginationAwareObject>;
  findById(id: number): Promise<Class | undefined>;
  create(createClass: ICreateClassDTO): Promise<Class>;
  delete(id: number): Promise<void>;
  save(saveClass: ISaveClassDTO): Promise<Class>;
}

export default IClassesRepository;
