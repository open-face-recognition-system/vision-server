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
import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import SubjectStudent from '@modules/subjects/infra/typeorm/entities/SubjectStudent';
import IAttendancesRepository from '@modules/semesters/repositories/IAttendancesRepository';
import IDownloadProvider from '@shared/container/providers/DownloadProvider/models/IDownloadProvider';
import IRecognitionFilesRepository from '../repositories/IRecognitionFilesRepository';

interface IRequest {
  subjectId: number;
}

interface IRecognizeRequest {
  classId: number;
  filePath: string;
}

interface IRecognizeResponse {
  student: Student;
  confidence: number;
}

interface TrainingResponse {
  ids: number[];
  photosPath: string[];
}

@injectable()
class RecognitionService {
  private subjectsStudentsRepository: ISubjectsRepository;

  private classesRepository: IClassesRepository;

  private studentsRepository: IStudentsRepository;

  private attendancesRepository: IAttendancesRepository;

  private recognitionProvider: IRecognitionProvider;

  private storageProvider: IStorageProvider;

  private downloadProvider: IDownloadProvider;

  private recognitionFilesRepository: IRecognitionFilesRepository;

  constructor(
    @inject('SubjectsRepository')
    subjectsStudentsRepository: ISubjectsRepository,
    @inject('ClassesRepository')
    classesRepository: IClassesRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('RecognitionFileStorageProvider')
    storageProvider: IStorageProvider,
    @inject('RecognitionProvider')
    recognitionProvider: IRecognitionProvider,
    @inject('AttendancesRepository')
    attendancesRepository: IAttendancesRepository,
    @inject('DownloadProvider')
    downloadProvider: IDownloadProvider,
    @inject('RecognitionFilesRepository')
    recognitionFilesRepository: IRecognitionFilesRepository,
  ) {
    this.subjectsStudentsRepository = subjectsStudentsRepository;
    this.classesRepository = classesRepository;
    this.studentsRepository = studentsRepository;
    this.storageProvider = storageProvider;
    this.recognitionProvider = recognitionProvider;
    this.attendancesRepository = attendancesRepository;
    this.downloadProvider = downloadProvider;
    this.recognitionFilesRepository = recognitionFilesRepository;
  }

  public async training({ subjectId }: IRequest): Promise<boolean> {
    const subject = await this.subjectsStudentsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const { students } = subject;

    if (subject.students.length <= 1) {
      throw new AppError('Subject needs at least one student');
    }

    const ids: number[] = [];
    const photosPath: string[] = [];

    const studentsPromise = students.map(async subjectStudent => {
      const { photos } = subjectStudent.student;

      if (photos.length === 0) {
        throw new AppError('Student needs at least one photo');
      }

      const photosIds = this.getAllPhotosAndIds(subjectStudent);

      ids.push(...photosIds.ids);
      photosPath.push(...photosIds.photosPath);

      await this.downloadAllStudentsPhotos(photos);
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
    await this.storageProvider.saveFile(filePath);
    if (!fileExists) {
      const recognitionFile = await this.recognitionFilesRepository.create({
        path: filePath,
      });
      await this.subjectsStudentsRepository.save({
        id: subject.id,
        recognitionFile,
      });
    }

    await this.deleteTmpFile();
    return true;
  }

  getAllPhotosAndIds(subjectStudent: SubjectStudent): TrainingResponse {
    const { photos } = subjectStudent.student;
    const ids: number[] = [];
    const photosPath: string[] = [];
    photos.map(async photo => {
      const photoPath = path.resolve(uploadConfig.tmpFolder, photo.path);
      photosPath.push(photoPath);
      ids.push(subjectStudent.student.id);
    });
    return {
      ids,
      photosPath,
    };
  }

  async deleteTmpFile(): Promise<void> {
    fs.readdir('./tmp', (err, files) => {
      files.forEach(async file => {
        const stat = await fs.promises.lstat(`./tmp/${file}`);
        if (stat.isFile()) {
          await this.storageProvider.deleteTmpFile(file);
        }
      });
    });
  }

  public async downloadAllStudentsPhotos(photos: Photo[]): Promise<void> {
    const downloadPhotosPromise = photos.map(async photo => {
      await this.downloadProvider.download(photo.getUrl() || '', photo.path);
    });

    await Promise.all(downloadPhotosPromise);
  }

  public async recognize({
    classId,
    filePath,
  }: IRecognizeRequest): Promise<IRecognizeResponse> {
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

    const [studentId, confidence] = response.split(',');

    console.log(confidence);

    if (Number(confidence) > 65) {
      throw new AppError('Aluno não reconhecido');
    }

    const student = await this.studentsRepository.findById(Number(studentId));

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const attendances = await this.attendancesRepository.findAllByClassId(
      classId,
    );

    const findAttendance = attendances.find(
      attendance => attendance.student.id === student.id,
    );

    if (findAttendance) {
      this.attendancesRepository.save({
        id: findAttendance.id,
        class: classExists,
        student,
        isPresent: true,
      });
    }

    return { student, confidence: Number(confidence) };
  }
}

export default RecognitionService;
