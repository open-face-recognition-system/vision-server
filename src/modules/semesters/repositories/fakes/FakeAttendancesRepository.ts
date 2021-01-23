import ICreateAttendanceDTO from '@modules/semesters/dtos/ICreateAttendanceDTO';
import ISaveAttendanceDTO from '@modules/semesters/dtos/ISaveAttendanceDTO';
import Attendance from '@modules/semesters/infra/typeorm/entities/Attendance';
import Pagination from '@shared/dtos/Pagination';
import IAttendancesRepository from '../IAttendancesRepository';

class FakeAttendancesRepository implements IAttendancesRepository {
  private attendances: Attendance[] = [];

  public async findAllWithPagination(query: any): Promise<Pagination> {
    if (!query) {
      return {
        data: [],
        total: 0,
      };
    }
    return {
      data: this.attendances,
      total: this.attendances.length,
    };
  }

  public async findAllByClassId(classId: number): Promise<Attendance[]> {
    const findClasses = this.attendances.filter(
      currentAttendance => currentAttendance.class.id === classId,
    );
    return findClasses;
  }

  public async findById(id: number): Promise<Attendance | undefined> {
    const attendance = this.attendances.find(
      currentAttendance => currentAttendance.id === id,
    );
    return attendance;
  }

  public async create(attendance: ICreateAttendanceDTO): Promise<Attendance> {
    const newAttendance = new Attendance();

    Object.assign(newAttendance, { id: Math.random() }, attendance);

    this.attendances.push(newAttendance);

    return newAttendance;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.attendances.findIndex(
      attendance => attendance.id === id,
    );
    this.attendances.splice(findIndex, 1);
  }

  public async save(attendance: ISaveAttendanceDTO): Promise<Attendance> {
    const findIndex = this.attendances.findIndex(
      findAttendance => findAttendance.id === attendance.id,
    );

    const updatedAttendance = new Attendance();

    updatedAttendance.id = attendance.id;
    updatedAttendance.isPresent = attendance.isPresent;
    updatedAttendance.student = attendance.student;
    updatedAttendance.class = attendance.class;
    this.attendances[findIndex] = updatedAttendance;

    return updatedAttendance;
  }
}

export default FakeAttendancesRepository;
