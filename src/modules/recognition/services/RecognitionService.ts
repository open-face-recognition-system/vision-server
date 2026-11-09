import path from 'path';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import IRecognitionProvider, {
  Samples,
} from '@shared/container/providers/RecognitionProvider/models/IRecognitionProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ISubjectsRepository from '@modules/subjects/repositories/ISubjectsRepository';
import IClassesRepository from '@modules/semesters/repositories/IClassesRepository';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import IAttendancesRepository from '@modules/semesters/repositories/IAttendancesRepository';
import Student from '@modules/users/infra/typeorm/entities/Student';
import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import Class from '@modules/semesters/infra/typeorm/entities/Class';
import IRecognitionFilesRepository from '../repositories/IRecognitionFilesRepository';

interface ITrainingRequest {
  subjectId: number;
}

interface IRecognizeRequest {
  classId: number;
  file: string;
}

interface IUpdateRequest extends IRecognizeRequest {
  studentId: number;
}

interface IRecognizeResponse {
  student: Student;
  attendanceId: number;
  confidence: number;
}

@injectable()
class RecognitionService {
  constructor(
    @inject('SubjectsRepository')
    private subjectsRepository: ISubjectsRepository,
    @inject('ClassesRepository')
    private classesRepository: IClassesRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('RecognitionProvider')
    private recognitionProvider: IRecognitionProvider,
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
    @inject('RecognitionFilesRepository')
    private recognitionFilesRepository: IRecognitionFilesRepository,
    @inject('RecognitionThreshold')
    private threshold: number,
  ) {}

  public async training({ subjectId }: ITrainingRequest): Promise<void> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exist');
    }

    const modelFile = await this.recognitionProvider.train(subject.id, this.trainingSamples(subject));

    const recognitionFile =
      (await this.recognitionFilesRepository.findByPath(modelFile)) ??
      (await this.recognitionFilesRepository.create({ path: modelFile }));

    await this.subjectsRepository.save({ id: subject.id, recognitionFile });
  }

  public async recognize({ classId, file }: IRecognizeRequest): Promise<IRecognizeResponse> {
    try {
      const lecture = await this.findTrainedClass(classId);

      const { studentId, distance } = await this.recognitionProvider.predict(
        lecture.subject.id,
        this.tmpPath(file),
      );

      if (distance > this.threshold) {
        throw new AppError('Student not recognized');
      }

      const student = await this.studentsRepository.findById(studentId);

      if (!student) {
        throw new AppError('Student does not exist');
      }

      const attendances = await this.attendancesRepository.findAllByClassId(classId);
      const attendance = attendances.find(current => current.student.id === student.id);

      if (!attendance) {
        throw new AppError('Student is not on the attendance list');
      }

      await this.attendancesRepository.save({
        id: attendance.id,
        class: lecture,
        student,
        isPresent: true,
      });

      return { student, confidence: distance, attendanceId: attendance.id };
    } finally {
      await this.storageProvider.deleteTmpFile(file);
    }
  }

  public async update({ studentId, classId, file }: IUpdateRequest): Promise<void> {
    try {
      const lecture = await this.findTrainedClass(classId);

      const enrolled = lecture.subject.students.some(
        current => current.isEnrolled && current.student.id === studentId,
      );

      if (!enrolled) {
        throw new AppError('Student is not enrolled in this subject');
      }

      await this.recognitionProvider.update(lecture.subject.id, {
        ids: [studentId],
        paths: [this.tmpPath(file)],
      });
    } finally {
      await this.storageProvider.deleteTmpFile(file);
    }
  }

  private trainingSamples(subject: Subject): Samples {
    const enrolled = subject.students.filter(current => current.isEnrolled);

    if (enrolled.length < 2) {
      throw new AppError('Subject needs at least two enrolled students');
    }

    if (enrolled.some(({ student }) => student.photos.length === 0)) {
      throw new AppError('Every enrolled student needs at least one photo');
    }

    const photos = enrolled.flatMap(({ student }) =>
      student.photos.map(photo => ({ id: student.id, path: path.join(uploadConfig.uploadsFolder, photo.path) })),
    );

    return { ids: photos.map(photo => photo.id), paths: photos.map(photo => photo.path) };
  }

  private async findTrainedClass(classId: number): Promise<Class> {
    const lecture = await this.classesRepository.findById(classId);

    if (!lecture) {
      throw new AppError('Class does not exist');
    }

    if (!lecture.subject.recognitionFile) {
      throw new AppError('Subject has not been trained yet');
    }

    return lecture;
  }

  private tmpPath(file: string): string {
    return path.join(uploadConfig.tmpFolder, file);
  }
}

export default RecognitionService;
