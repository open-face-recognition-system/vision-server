import Semester from '@modules/semesters/infra/typeorm/entities/Semester';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateSemesters implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Semester)().createMany(2);
  }
}
