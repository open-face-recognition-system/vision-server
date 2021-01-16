import request from 'request';
import fs from 'fs';
import path from 'path';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import uploadConfig from '@config/upload';
import IRecognitionProvider from '@shared/container/providers/RecognitionProvider/models/IRecognitionProvider';
import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Student from '@modules/users/infra/typeorm/entities/Student';
import IClassesRepository from '@modules/semesters/repositories/IClassesRepository';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import IRecognitionFilesRepository from '../repositories/IRecognitionFilesRepository';

interface IRequest {
  subjectId: number;
}

interface IRecognizeRequest {
  classId: number;
  filePath: string;
}

@injectable()
class RecognitionService {
  private subjectsStudentsRepository: ISubjectsRepository;

  private classesRepository: IClassesRepository;

  private studentsRepository: IStudentsRepository;

  private recognitionProvider: IRecognitionProvider;

  private storageProvider: IStorageProvider;

  private recognitionFilesRepository: IRecognitionFilesRepository;

  constructor(
    @inject('SubjectsRepository')
    subjectsStudentsRepository: ISubjectsRepository,
    @inject('ClassesRepository')
    classesRepository: IClassesRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('RecognizeFileStorageProvider')
    storageProvider: IStorageProvider,
    @inject('RecognitionProvider')
    recognitionProvider: IRecognitionProvider,
    @inject('RecognitionFilesRepository')
    recognitionFilesRepository: IRecognitionFilesRepository,
  ) {
    this.subjectsStudentsRepository = subjectsStudentsRepository;
    this.recognitionProvider = recognitionProvider;
    this.storageProvider = storageProvider;
    this.classesRepository = classesRepository;
    this.studentsRepository = studentsRepository;
    this.recognitionFilesRepository = recognitionFilesRepository;
  }

  public async recognize({
    classId,
    filePath,
  }: IRecognizeRequest): Promise<Student> {
    const classExists = await this.classesRepository.findById(classId);

    if (!classExists) {
      throw new AppError('Class does not exists');
    }

    const { subject } = classExists;

    const response = await this.recognitionProvider.recognize(
      subject.id,
      filePath,
    );

    await this.storageProvider.deleteTmpFile(filePath);

    const studentId = response.split(',')[0];

    const student = await this.studentsRepository.findById(Number(studentId));

    if (!student) {
      throw new AppError('Student does not exists');
    }

    return student;
  }

  public async training({ subjectId }: IRequest): Promise<void> {
    const subject = await this.subjectsStudentsRepository.findById(subjectId);
    const ids: number[] = [];
    const photosPath: string[] = [];

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const { students } = subject;

    if (subject.students.length <= 1) {
      throw new AppError('Subject needs at least one student');
    }

    const studentsPromise = students.map(async subjectStudent => {
      const downloadPhotosPromise = subjectStudent.student.photos.map(
        async photo => {
          await this.download(photo.getUrl() || '', photo.path);
          const photoPath = path.resolve(uploadConfig.tmpFolder, photo.path);
          photosPath.push(photoPath);
          ids.push(subjectStudent.student.id);
        },
      );
      await Promise.all(downloadPhotosPromise);
    });
    await Promise.all(studentsPromise);

    const fileName = await this.recognitionProvider.training(
      ids,
      photosPath,
      subject.id,
    );
    const filePath = fileName.trim();
    const fileExists = await this.recognitionFilesRepository.findByPath(
      filePath,
    );
    if (!fileExists) {
      await this.storageProvider.saveFile(filePath);
      const recognitionFile = await this.recognitionFilesRepository.create({
        path: filePath,
      });
      await this.subjectsStudentsRepository.save({
        id: subject.id,
        recognitionFile,
      });
    }

    fs.readdir('./tmp', (err, files) => {
      files.forEach(async file => {
        const stat = await fs.promises.lstat(`./tmp/${file}`);
        if (stat.isFile()) {
          await this.storageProvider.deleteTmpFile(file);
        }
      });
    });
  }

  private async download(uri: string, filename: string): Promise<void> {
    const file = fs.createWriteStream(`./tmp/${filename}`);

    await new Promise((resolve, reject) => {
      request({
        uri,
        gzip: true,
      })
        .pipe(file)
        .on('finish', async () => {
          resolve('ok');
        })
        .on('error', error => {
          reject(error);
        });
    }).catch(error => {
      console.log(`Something happened: ${error}`);
    });
  }
}

export default RecognitionService;
