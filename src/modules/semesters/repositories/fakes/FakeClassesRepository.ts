import ICreateClassDTO from '@modules/semesters/dtos/ICreateClassDTO';
import ISaveClassDTO from '@modules/semesters/dtos/ISaveClassDTO';
import Class from '@modules/semesters/infra/typeorm/entities/Class';
import Pagination from '@shared/dtos/Pagination';
import IClassesRepository from '../IClassesRepository';

class FakeClassesRepository implements IClassesRepository {
  private classes: Class[] = [];

  public async findAllWithPagination(query: any): Promise<Pagination> {
    if (!query) {
      return {
        data: [],
        total: 0,
      };
    }
    return {
      data: this.classes,
      total: this.classes.length,
    };
  }

  public async findAllByTeacherId(teacherId: number): Promise<Class[]> {
    const findClasses = this.classes.filter(
      currentClass => currentClass.subject.teacher.id === teacherId,
    );
    return findClasses;
  }

  public async findAllByTeacherIdWithPagination(
    teacherId: number,
    query: any,
  ): Promise<Pagination> {
    if (!query) {
      return {
        data: [],
        total: 0,
      };
    }
    return {
      data: this.classes.filter(
        currentClass => currentClass.subject.teacher.id === teacherId,
      ),
      total: this.classes.length,
    };
  }

  public async findById(id: number): Promise<Class | undefined> {
    const classExists = this.classes.find(
      currentClass => currentClass.id === id,
    );
    return classExists;
  }

  public async create(createClass: ICreateClassDTO): Promise<Class> {
    const newClass = new Class();

    Object.assign(newClass, { id: Math.random() }, createClass);

    this.classes.push(newClass);

    return newClass;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.classes.findIndex(
      currentClass => currentClass.id === id,
    );
    this.classes.splice(findIndex, 1);
  }

  public async save({
    id,
    startHour,
    endHour,
    date,
    semester,
    subject,
  }: ISaveClassDTO): Promise<Class> {
    const findIndex = this.classes.findIndex(findClass => findClass.id === id);

    const updatedClass = new Class();

    updatedClass.id = id;
    updatedClass.startHour = startHour;
    updatedClass.endHour = endHour;
    updatedClass.date = date;
    updatedClass.semester = semester;
    updatedClass.subject = subject;
    this.classes[findIndex] = updatedClass;

    return updatedClass;
  }
}

export default FakeClassesRepository;
