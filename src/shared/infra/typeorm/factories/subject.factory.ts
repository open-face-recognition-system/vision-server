import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import Teacher from '@modules/users/infra/typeorm/entities/Teacher';
import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';

define(Subject, (faker: typeof Faker) => {
  const subject = new Subject();
  subject.name = faker.name.jobArea();
  subject.course = faker.commerce.department();
  subject.description = faker.lorem.paragraph();
  subject.teacher = factory(Teacher)() as any;
  return subject;
});
