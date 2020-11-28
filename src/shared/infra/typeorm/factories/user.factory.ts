import * as Faker from 'faker';
import User from '@modules/users/infra/typeorm/entities/User';
import { define } from 'typeorm-seeding';
import Role from '@modules/users/infra/typeorm/entities/Role';

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);

  const user = new User();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.role = Role.ADMIN;
  user.password =
    '$2a$08$GFF5JPtqxxDV7O541tew0uwayAxGTFFpchFSYDuuKA47ZWma9CtNe';

  return user;
});
