import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';

import StudentsRepository from '@modules/users/infra/typeorm/repositories/StudentsRepository';

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import PhotoHandler from './PhotoHandler';

class Training {
  private studentsRepository: IStudentsRepository;

  constructor() {
    this.studentsRepository = new StudentsRepository();
  }

  public async prepareEnviroment(): Promise<void> {
    await this.getAllStudentsAndDownloadPhotos();
  }

  public async training(): Promise<void> {
    const ids: number[] = [];
    const photos: string[] = [];

    const students = await this.studentsRepository.findAll();
    const validStudents = students.filter(
      student => student.photos.length === 30,
    );
    const tmpFolder = path.resolve(__dirname, 'temp', '25');

    validStudents.forEach(student => {
      student.photos.forEach(photo => {
        const filePath = path.join(tmpFolder, photo.path);
        if (fs.existsSync(filePath)) {
          console.log(filePath);

          photos.push(filePath);
          ids.push(student.id);
        }
      });
    });

    const pythonProcess = spawn('python', [
      './src/modules/validation/python/training.py',
      JSON.stringify(ids),
      JSON.stringify(photos),
      '25',
    ]);

    pythonProcess.stdout.on('data', async data => {
      console.log(data);
    });
  }

  private async getAllStudentsAndDownloadPhotos() {
    const students = await this.studentsRepository.findAll();
    const validStudents = students.filter(
      student => student.photos.length === 30,
    );

    const validStudetnsPromise = validStudents.map(async validStudent => {
      const { photos } = validStudent;
      const photoHandler = new PhotoHandler(photos);
      photoHandler.addedTestSet();
      photoHandler.addedFiveSet();
      photoHandler.addedTenSet();
      photoHandler.addedTwentyFiveSet();
    });

    await Promise.all(validStudetnsPromise);
  }
}

export default Training;
