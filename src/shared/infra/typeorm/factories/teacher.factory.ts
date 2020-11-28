import * as Faker from 'faker';
import User from '@modules/users/infra/typeorm/entities/User';
import { define, factory } from 'typeorm-seeding';
import Teacher from '@modules/users/infra/typeorm/entities/Teacher';
import Role from '@modules/users/infra/typeorm/entities/Role';

define(Teacher, (faker: typeof Faker) => {
  const teacher = new Teacher();
  teacher.enrollment = faker.internet.password(10, false, /[0-9]/);
  teacher.user = factory(User)({ role: Role.TEACHER }) as any;
  return teacher;
});
