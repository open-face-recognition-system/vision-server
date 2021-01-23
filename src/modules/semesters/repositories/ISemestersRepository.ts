import Pagination from '@shared/dtos/Pagination';
import ICreateSemesterDTO from '../dtos/ICreateSemesterDTO';
import ISaveSemesterDTO from '../dtos/ISaveSemesterDTO';
import Semester from '../infra/typeorm/entities/Semester';

interface ISemestersRepository {
  findAllWithPagination(query: any): Promise<Pagination>;
  findById(id: number): Promise<Semester | undefined>;
  create(semester: ICreateSemesterDTO): Promise<Semester>;
  delete(id: number): Promise<void>;
  save(semester: ISaveSemesterDTO): Promise<Semester>;
}

export default ISemestersRepository;
