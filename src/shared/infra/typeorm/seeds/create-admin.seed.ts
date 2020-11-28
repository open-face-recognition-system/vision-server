import Role from '@modules/users/infra/typeorm/entities/Role';
import User from '@modules/users/infra/typeorm/entities/User';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          name: 'Admin',
          email: 'admin@admin.com',
          password:
            "'$2a$08$GFF5JPtqxxDV7O541tew0uwayAxGTFFpchFSYDuuKA47ZWma9CtNe'",
          role: Role.ADMIN,
        },
      ])
      .execute();
  }
}
