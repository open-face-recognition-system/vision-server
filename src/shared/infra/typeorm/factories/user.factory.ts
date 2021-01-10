import Role from '@modules/users/infra/typeorm/entities/Role';
import User from '@modules/users/infra/typeorm/entities/User';
import Faker from 'faker';
import { define } from 'typeorm-seeding';

define(User, (faker: typeof Faker, role: Role | undefined) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);

  const user = new User();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.role = role || Role.ADMIN;
  user.password =
    '$2a$08$GFF5JPtqxxDV7O541tew0uwayAxGTFFpchFSYDuuKA47ZWma9CtNe';

  return user;
});
