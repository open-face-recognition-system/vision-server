import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import ICreateAttendenceDTO from '../dtos/ICreateAttendenceDTO';
import ISaveAttendenceDTO from '../dtos/ISaveAttendenceDTO';
import Attendence from '../infra/typeorm/entities/Attendence';

interface IAttendencesRepository {
  findAllWithPagination(): Promise<PaginationAwareObject>;
  findById(id: number): Promise<Attendence | undefined>;
  create(attendence: ICreateAttendenceDTO): Promise<Attendence>;
  delete(id: number): Promise<void>;
  save(attendence: ISaveAttendenceDTO): Promise<Attendence>;
}

export default IAttendencesRepository;
