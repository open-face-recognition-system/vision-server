import ICreateStudentDTO from '@modules/users/dtos/ICreateStudentDTO';
import Student from '@modules/users/infra/typeorm/entities/Student';
import User from '@modules/users/infra/typeorm/entities/User';
import IStudentsRepository from '../IStudentsRepository';

class FakeStudentsRepository implements IStudentsRepository {
  private students: Student[] = [];

  public async listAll(take: number, skip: number): Promise<Student[]> {
    return this.students.slice((skip - 1) * take, skip * take);
  }

  public async findById(id: number): Promise<Student | undefined> {
    const findStudent = this.students.find(student => student.id === id);
    return findStudent;
  }

  public async findByUser(user: User): Promise<Student | undefined> {
    const findStudent = this.students.find(student => student.user === user);
    return findStudent;
  }

  public async findByEnrollment(
    enrollment: string,
  ): Promise<Student | undefined> {
    const findStudent = this.students.find(
      student => student.enrollment === enrollment,
    );
    return findStudent;
  }

  public async create(student: ICreateStudentDTO): Promise<Student> {
    const newStudent = new Student();

    Object.assign(newStudent, { id: Math.random() }, student);

    this.students.push(newStudent);

    return newStudent;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.students.findIndex(
      findStudent => findStudent.id === id,
    );
    this.students.splice(findIndex, 1);
  }

  public async save(student: Student): Promise<Student> {
    const findIndex = this.students.findIndex(
      findStudent => findStudent.id === student.id,
    );
    this.students[findIndex] = student;
    return student;
  }
}

export default FakeStudentsRepository;
