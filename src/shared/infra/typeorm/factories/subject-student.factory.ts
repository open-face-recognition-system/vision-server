import { define, factory } from 'typeorm-seeding';
import SubjectStudent from '@modules/subjects/infra/typeorm/entities/SubjectStudent';
import Student from '@modules/users/infra/typeorm/entities/Student';
import Subject from '@modules/subjects/infra/typeorm/entities/Subject';

define(SubjectStudent, () => {
  const subjectStudent = new SubjectStudent();
  subjectStudent.isEnrolled = true;
  subjectStudent.student = factory(Student)() as any;
  subjectStudent.subject = factory(Subject)() as any;
  return subjectStudent;
});
