import Semester from '@modules/semesters/infra/typeorm/entities/Semester';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

define(Semester, (faker: typeof Faker) => {
  const semester = new Semester();
  semester.startDate = faker.date.past();
  semester.endDate = faker.date.future();
  return semester;
});
