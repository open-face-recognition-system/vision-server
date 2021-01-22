import ICreateSubjectStudentDOT from '@modules/subjects/dtos/ICreateSubjectStudentDOT';
import ISaveSubjectStudentDOT from '@modules/subjects/dtos/ISaveSubjectStudentDOT';
import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import SubjectStudent from '@modules/subjects/infra/typeorm/entities/SubjectStudent';
import Student from '@modules/users/infra/typeorm/entities/Student';
import ISubjectsStudentsRepository from '../ISubjectsStudentsRepository';

class FakeSubjectsStudentsRepository implements ISubjectsStudentsRepository {
  private subjectStudents: SubjectStudent[] = [];

  public async findByStudent(
    subject: Subject,
    student: Student,
  ): Promise<SubjectStudent | undefined> {
    const subjectStudents = this.subjectStudents.find(
      subjectStudent =>
        subjectStudent.id === student.id &&
        subjectStudent.subject.id === subject.id,
    );
    return subjectStudents;
  }

  public async create(
    subjectStudent: ICreateSubjectStudentDOT,
  ): Promise<SubjectStudent> {
    const newSubjectStudent = new SubjectStudent();

    Object.assign(newSubjectStudent, { id: Math.random() }, subjectStudent);

    this.subjectStudents.push(newSubjectStudent);

    return newSubjectStudent;
  }

  public async deleteByStudent(student: Student): Promise<void> {
    const findIndex = this.subjectStudents.findIndex(
      subjectStudent => subjectStudent.student.id === student.id,
    );
    this.subjectStudents.splice(findIndex, 1);
  }

  public async save(
    subjectStudent: ISaveSubjectStudentDOT,
  ): Promise<SubjectStudent> {
    const findIndex = this.subjectStudents.findIndex(
      findSubjectStudent => findSubjectStudent.id === subjectStudent.id,
    );

    const updatedSubjectStudent = new SubjectStudent();
    updatedSubjectStudent.id = subjectStudent.id;
    updatedSubjectStudent.student = subjectStudent.student;
    updatedSubjectStudent.subject = subjectStudent.subject;
    updatedSubjectStudent.isEnrolled = subjectStudent.isEnrolled;

    this.subjectStudents[findIndex] = updatedSubjectStudent;

    return updatedSubjectStudent;
  }
}

export default FakeSubjectsStudentsRepository;
