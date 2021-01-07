import Pagination from '@shared/dtos/Pagination';
import ICreateSubjectDOT from '../dtos/ICreateSubjectDOT';
import ISaveSubjectDOT from '../dtos/ISaveSubjectDOT';
import Subject from '../infra/typeorm/entities/Subject';

interface ISubjectsRepository {
  findAllWithPagination(query: any): Promise<Pagination>;
  findById(id: number): Promise<Subject | undefined>;
  create(subject: ICreateSubjectDOT): Promise<Subject>;
  delete(id: number): Promise<void>;
  save(subject: ISaveSubjectDOT): Promise<Subject>;
}

export default ISubjectsRepository;
