import Student from '@modules/users/infra/typeorm/entities/Student';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateStudents implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Student)().createMany(10);
  }
}
