import ICreateSubjectDOT from '@modules/subjects/dtos/ICreateSubjectDOT';
import ISaveSubjectDOT from '@modules/subjects/dtos/ISaveSubjectDOT';
import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import Pagination from '@shared/dtos/Pagination';
import ISubjectsRepository from '../ISubjectsRepository';

class FakeSubjectsRepository implements ISubjectsRepository {
  private subjects: Subject[] = [];

  public async findAllWithPagination(query: any): Promise<Pagination> {
    if (!query) {
      return {
        data: [],
        total: 0,
      };
    }
    return {
      data: this.subjects,
      total: this.subjects.length,
    };
  }

  public async findAllByTeacherId(
    teacherId: number,
    query: any,
  ): Promise<Pagination> {
    if (!query) {
      return {
        data: this.subjects.filter(subject => subject.teacher.id === teacherId),
        total: this.subjects.length,
      };
    }
    return {
      data: this.subjects.filter(subject => subject.teacher.id === teacherId),
      total: this.subjects.length,
    };
  }

  public async findById(id: number): Promise<Subject | undefined> {
    const subject = this.subjects.find(
      currentSubject => currentSubject.id === id,
    );
    return subject;
  }

  public async create(subject: ICreateSubjectDOT): Promise<Subject> {
    const newSubject = new Subject();

    Object.assign(newSubject, { id: Math.random() }, subject);

    this.subjects.push(newSubject);

    return newSubject;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.subjects.findIndex(subject => subject.id === id);
    this.subjects.splice(findIndex, 1);
  }

  public async save({
    id,
    name,
    course,
    description,
  }: ISaveSubjectDOT): Promise<Subject> {
    const findIndex = this.subjects.findIndex(
      findSubject => findSubject.id === id,
    );

    const updatedSubject = new Subject();

    updatedSubject.id = id;
    updatedSubject.name = name || 'name';
    updatedSubject.course = course || 'course';
    updatedSubject.description = description || 'description';
    this.subjects[findIndex] = updatedSubject;

    return updatedSubject;
  }
}

export default FakeSubjectsRepository;
