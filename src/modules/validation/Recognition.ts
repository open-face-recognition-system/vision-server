import { injectable, inject } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';

@injectable()
class Recognition {
  private studentsRepository: IStudentsRepository;

  constructor(
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
  ) {
    this.studentsRepository = studentsRepository;
  }

  public async recognize(): Promise<void> {
    const filePath = path.resolve(__dirname, 'temp', 'tests');
    console.log('Aguarde...');
    fs.readdir(filePath, (err, files) => {
      files.forEach(file => {
        const newFilePath = path.resolve(__dirname, 'temp', 'tests', file);
        const pythonProcess = spawn('python', [
          './src/modules/validation/python/eigenfaces.py',
          newFilePath,
          '10',
        ]);

        pythonProcess.stdout.on('data', async data => {
          const [studentId, conf] = data.toString().split(',');
          const student = await this.studentsRepository.findById(studentId);
          const confidence = Number(conf);
          const findPhoto = student?.photos.find(photo => photo.path === file);
          console.log(
            `${student?.user.name} | ${confidence}% | ${findPhoto?.path}`,
          );
        });
      });
    });
  }
}

export default Recognition;
