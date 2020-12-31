import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import ICreateAttendanceDTO from '../dtos/ICreateAttendanceDTO';
import ISaveAttendanceDTO from '../dtos/ISaveAttendanceDTO';
import Attendance from '../infra/typeorm/entities/Attendance';

interface IAttendancesRepository {
  findAllWithPagination(query: any): Promise<PaginationAwareObject>;
  findById(id: number): Promise<Attendance | undefined>;
  create(attendance: ICreateAttendanceDTO): Promise<Attendance>;
  delete(id: number): Promise<void>;
  save(attendance: ISaveAttendanceDTO): Promise<Attendance>;
}

export default IAttendancesRepository;
