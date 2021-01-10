import * as Faker from 'faker';
import User from '@modules/users/infra/typeorm/entities/User';
import { define, factory } from 'typeorm-seeding';
import Student from '@modules/users/infra/typeorm/entities/Student';
import Role from '@modules/users/infra/typeorm/entities/Role';

define(Student, (faker: typeof Faker) => {
  const student = new Student();
  student.enrollment = faker.internet.password(10, false, /[0-9]/);
  student.user = factory(User)(Role.STUDENT) as any;
  return student;
});
