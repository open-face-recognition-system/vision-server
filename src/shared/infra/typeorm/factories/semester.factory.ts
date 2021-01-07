import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import Semester from '@modules/semesters/infra/typeorm/entities/Semester';

define(Semester, (faker: typeof Faker) => {
  const semester = new Semester();
  semester.startDate = faker.date.past();
  semester.endDate = faker.date.future();
  return semester;
});
