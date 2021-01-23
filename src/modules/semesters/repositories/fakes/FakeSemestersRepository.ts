import ICreateSemesterDTO from '@modules/semesters/dtos/ICreateSemesterDTO';
import ISaveSemesterDTO from '@modules/semesters/dtos/ISaveSemesterDTO';
import Semester from '@modules/semesters/infra/typeorm/entities/Semester';
import Pagination from '@shared/dtos/Pagination';
import ISemestersRepository from '../ISemestersRepository';

class FakeSemestersRepository implements ISemestersRepository {
  private semesters: Semester[] = [];

  public async findAllWithPagination(query: any): Promise<Pagination> {
    if (!query) {
      return {
        data: [],
        total: 0,
      };
    }
    return {
      data: this.semesters,
      total: this.semesters.length,
    };
  }

  public async findById(id: number): Promise<Semester | undefined> {
    const semester = this.semesters.find(
      currentSemester => currentSemester.id === id,
    );
    return semester;
  }

  public async create(semester: ICreateSemesterDTO): Promise<Semester> {
    const newSemester = new Semester();

    Object.assign(newSemester, { id: Math.random() }, semester);

    this.semesters.push(newSemester);

    return newSemester;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.semesters.findIndex(semester => semester.id === id);
    this.semesters.splice(findIndex, 1);
  }

  public async save({
    id,
    startDate,
    endDate,
  }: ISaveSemesterDTO): Promise<Semester> {
    const findIndex = this.semesters.findIndex(
      findSemester => findSemester.id === id,
    );

    const updatedSemester = new Semester();

    updatedSemester.id = id;
    updatedSemester.startDate = startDate;
    updatedSemester.endDate = endDate;
    this.semesters[findIndex] = updatedSemester;

    return updatedSemester;
  }
}

export default FakeSemestersRepository;
