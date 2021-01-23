import path from 'path';
import fs from 'fs';
import { Factory, Seeder } from 'typeorm-seeding';
import Student from '@modules/users/infra/typeorm/entities/Student';
import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import { Connection } from 'typeorm';
import PhotoType from '@modules/photos/infra/typeorm/entities/PhotoType';
import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import SubjectStudent from '@modules/subjects/infra/typeorm/entities/SubjectStudent';

export default class CreatePhotos implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const tmpFolder = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'tmp',
      'att_faces',
      'Training',
    );
    const resultFolder = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'tmp',
      'uploads',
    );
    const subject = await factory(Subject)().create();
    for (let i = 1; i <= 40; i++) {
      const sampleFolder = path.resolve(tmpFolder, `s${i}`);
      const files = fs.readdirSync(sampleFolder);
      const student = await factory(Student)().create();
      await connection
        .createQueryBuilder()
        .insert()
        .into(SubjectStudent)
        .values([
          {
            isEnrolled: true,
            subject,
            student,
          },
        ])
        .execute();
      const filesPromise = files.map(async file => {
        fs.renameSync(
          `${sampleFolder}/${file.toString()}`,
          `${resultFolder}/${student.id}-${file.toString()}`,
        );
        await connection
          .createQueryBuilder()
          .insert()
          .into(Photo)
          .values([
            {
              path: `${student.id}-${file.toString()}`,
              photoType: PhotoType.NORMAL,
              student,
            },
          ])
          .execute();
      });
      await Promise.all(filesPromise);
    }
  }
}
