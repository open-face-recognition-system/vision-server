import path from 'path';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import Student from '@modules/users/infra/typeorm/entities/Student';
import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import SubjectStudent from '@modules/subjects/infra/typeorm/entities/SubjectStudent';
import Class from '@modules/semesters/infra/typeorm/entities/Class';
import RecognitionFile from '@modules/recognition/infra/typeorm/entities/RecognitionFile';
import FakeSubjectsRepository from '@modules/subjects/repositories/fakes/FakeSubjectsRepository';
import FakeClassesRepository from '@modules/semesters/repositories/fakes/FakeClassesRepository';
import FakeStudentsRepository from '@modules/users/repositories/fakes/FakeStudentsRepository';
import FakeAttendancesRepository from '@modules/semesters/repositories/fakes/FakeAttendancesRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeRecognitionProvider from '@shared/container/providers/RecognitionProvider/fakes/FakeRecognitionProvider';
import FakeRecognitionFilesRepository from '../repositories/fakes/FakeRecognitionFilesRepository';
import RecognitionService from './RecognitionService';

const THRESHOLD = 70;

const buildStudent = (id: number, photoPaths: string[]): Student =>
  Object.assign(new Student(), {
    id,
    photos: photoPaths.map(photoPath => Object.assign(new Photo(), { path: photoPath })),
  });

const enroll = (student: Student, isEnrolled = true): SubjectStudent =>
  Object.assign(new SubjectStudent(), { student, isEnrolled });

describe('RecognitionService', () => {
  let subjectsRepository: FakeSubjectsRepository;
  let classesRepository: FakeClassesRepository;
  let studentsRepository: FakeStudentsRepository;
  let attendancesRepository: FakeAttendancesRepository;
  let storageProvider: FakeStorageProvider;
  let recognitionProvider: FakeRecognitionProvider;
  let recognitionFilesRepository: FakeRecognitionFilesRepository;
  let recognitionService: RecognitionService;

  let alice: Student;
  let bob: Student;
  let subject: Subject;
  let lecture: Class;

  beforeEach(async () => {
    subjectsRepository = new FakeSubjectsRepository();
    classesRepository = new FakeClassesRepository();
    studentsRepository = new FakeStudentsRepository();
    attendancesRepository = new FakeAttendancesRepository();
    storageProvider = new FakeStorageProvider();
    recognitionProvider = new FakeRecognitionProvider();
    recognitionFilesRepository = new FakeRecognitionFilesRepository();

    recognitionService = new RecognitionService(
      subjectsRepository,
      classesRepository,
      studentsRepository,
      storageProvider,
      recognitionProvider,
      attendancesRepository,
      recognitionFilesRepository,
      THRESHOLD,
    );

    alice = await studentsRepository.create(buildStudent(1, ['alice-1.jpg', 'alice-2.jpg']) as never);
    bob = await studentsRepository.create(buildStudent(2, ['bob-1.jpg']) as never);

    subject = await subjectsRepository.create({
      students: [enroll(alice), enroll(bob)],
      recognitionFile: Object.assign(new RecognitionFile(), { path: 'subject-model.yml' }),
    } as never);

    lecture = await classesRepository.create({
      startHour: new Date(),
      endHour: new Date(),
      date: new Date(),
      semester: {} as never,
      subject,
    });
    await attendancesRepository.create({ isPresent: false, class: lecture, student: alice });
  });

  describe('training', () => {
    it('trains with the uploaded photos of enrolled students only', async () => {
      const carol = buildStudent(3, ['carol-1.jpg']);
      subject.students.push(enroll(carol, false));

      await recognitionService.training({ subjectId: subject.id });

      expect(recognitionProvider.trainedWith).toEqual({
        subjectId: subject.id,
        ids: [1, 1, 2],
        paths: ['alice-1.jpg', 'alice-2.jpg', 'bob-1.jpg'].map(file =>
          path.join(uploadConfig.uploadsFolder, file),
        ),
      });
    });

    it('links the trained model to the subject', async () => {
      subject.recognitionFile = undefined;

      await recognitionService.training({ subjectId: subject.id });

      const saved = await subjectsRepository.findById(subject.id);
      expect(saved?.recognitionFile?.path).toBe(`subject-${subject.id}.yml`);
    });

    it('rejects a subject with fewer than two enrolled students', async () => {
      subject.students = [enroll(alice), enroll(bob, false)];

      await expect(
        recognitionService.training({ subjectId: subject.id }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('rejects an enrolled student without photos', async () => {
      bob.photos = [];

      await expect(
        recognitionService.training({ subjectId: subject.id }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('recognize', () => {
    it('marks the recognized student as present', async () => {
      recognitionProvider.nextPrediction = { studentId: alice.id, distance: 42 };

      const response = await recognitionService.recognize({ classId: lecture.id, file: 'probe.jpg' });

      const [attendance] = await attendancesRepository.findAllByClassId(lecture.id);
      expect(attendance.isPresent).toBe(true);
      expect(response).toMatchObject({ student: alice, confidence: 42, attendanceId: attendance.id });
    });

    it('finishes saving the attendance before answering', async () => {
      recognitionProvider.nextPrediction = { studentId: alice.id, distance: 42 };
      let saved = false;
      jest.spyOn(attendancesRepository, 'save').mockImplementation(
        attendance =>
          new Promise(resolve => {
            setTimeout(() => {
              saved = true;
              resolve(attendance as never);
            }, 5);
          }),
      );

      await recognitionService.recognize({ classId: lecture.id, file: 'probe.jpg' });

      expect(saved).toBe(true);
    });

    it('predicts against the uploaded file in the tmp folder', async () => {
      recognitionProvider.nextPrediction = { studentId: alice.id, distance: 42 };

      await recognitionService.recognize({ classId: lecture.id, file: 'probe.jpg' });

      expect(recognitionProvider.predictedWith).toEqual({
        subjectId: subject.id,
        imagePath: path.join(uploadConfig.tmpFolder, 'probe.jpg'),
      });
    });

    it('rejects a match farther than the configured threshold', async () => {
      recognitionProvider.nextPrediction = { studentId: alice.id, distance: THRESHOLD + 1 };

      await expect(
        recognitionService.recognize({ classId: lecture.id, file: 'probe.jpg' }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('rejects a subject that has not been trained', async () => {
      subject.recognitionFile = undefined;
      recognitionProvider.nextPrediction = { studentId: alice.id, distance: 42 };

      await expect(
        recognitionService.recognize({ classId: lecture.id, file: 'probe.jpg' }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('deletes only its own uploaded file, even when recognition fails', async () => {
      const deleteTmpFile = jest.spyOn(storageProvider, 'deleteTmpFile');
      recognitionProvider.nextPrediction = { studentId: alice.id, distance: THRESHOLD + 1 };

      await expect(
        recognitionService.recognize({ classId: lecture.id, file: 'probe.jpg' }),
      ).rejects.toBeInstanceOf(AppError);

      expect(deleteTmpFile.mock.calls).toEqual([['probe.jpg']]);
    });
  });

  describe('update', () => {
    it('teaches the model a new photo of an enrolled student', async () => {
      await recognitionService.update({ classId: lecture.id, studentId: bob.id, file: 'bob-new.jpg' });

      expect(recognitionProvider.updatedWith).toEqual({
        subjectId: subject.id,
        ids: [bob.id],
        paths: [path.join(uploadConfig.tmpFolder, 'bob-new.jpg')],
      });
    });

    it('rejects a student not enrolled in the class subject', async () => {
      const outsider = buildStudent(99, []);
      await studentsRepository.create(outsider as never);

      await expect(
        recognitionService.update({ classId: lecture.id, studentId: outsider.id, file: 'x.jpg' }),
      ).rejects.toBeInstanceOf(AppError);
      expect(recognitionProvider.updatedWith).toBeUndefined();
    });

    it('deletes only its own uploaded file', async () => {
      const deleteTmpFile = jest.spyOn(storageProvider, 'deleteTmpFile');

      await recognitionService.update({ classId: lecture.id, studentId: bob.id, file: 'bob-new.jpg' });

      expect(deleteTmpFile.mock.calls).toEqual([['bob-new.jpg']]);
    });
  });
});