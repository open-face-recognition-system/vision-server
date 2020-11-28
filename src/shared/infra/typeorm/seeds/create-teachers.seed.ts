import Teacher from '@modules/users/infra/typeorm/entities/Teacher';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateTeachers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Teacher)().createMany(5);
  }
}
