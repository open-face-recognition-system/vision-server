import ICreateTeacherDTO from '@modules/users/dtos/ICreateTeacherDTO';
import Teacher from '@modules/users/infra/typeorm/entities/Teacher';
import User from '@modules/users/infra/typeorm/entities/User';
import Pagination from '@shared/dtos/Pagination';
import ITeachersRepository from '../ITeachersRepository';

class FakeTeachersRepository implements ITeachersRepository {
  private teachers: Teacher[] = [];

  public async findAllWithPagination(query: any): Promise<Pagination> {
    if (!query) {
      return {
        data: this.teachers,
        total: 0,
      };
    }
    return {
      data: this.teachers,
      total: this.teachers.length,
    };
  }

  public async findAllWithPaginationByName(name: string): Promise<Pagination> {
    return {
      data: this.teachers.filter(teacher => teacher.user.name === name),
      total: this.teachers.length,
    };
  }

  public async findById(id: number): Promise<Teacher | undefined> {
    const findTeacher = this.teachers.find(teacher => teacher.id === id);
    return findTeacher;
  }

  public async findByUser(user: User): Promise<Teacher | undefined> {
    const findTeacher = this.teachers.find(teacher => teacher.user === user);
    return findTeacher;
  }

  public async findByEnrollment(
    enrollment: string,
  ): Promise<Teacher | undefined> {
    const findTeacher = this.teachers.find(
      teacher => teacher.enrollment === enrollment,
    );
    return findTeacher;
  }

  public async create(teacher: ICreateTeacherDTO): Promise<Teacher> {
    const newTeacher = new Teacher();

    Object.assign(newTeacher, { id: Math.random() }, teacher);

    this.teachers.push(newTeacher);

    return newTeacher;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.teachers.findIndex(
      findTeacher => findTeacher.id === id,
    );
    this.teachers.splice(findIndex, 1);
  }

  public async save(teacher: Teacher): Promise<Teacher> {
    const findIndex = this.teachers.findIndex(
      findTeacher => findTeacher.id === teacher.id,
    );
    this.teachers[findIndex] = teacher;
    return teacher;
  }
}

export default FakeTeachersRepository;
