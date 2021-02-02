import PhotoType from '@modules/photos/infra/typeorm/entities/PhotoType';
import FakePhotosRepository from '@modules/photos/repositories/fakes/FakePhotosRepository';
import FakeAttendancesRepository from '@modules/semesters/repositories/fakes/FakeAttendancesRepository';
import FakeClassesRepository from '@modules/semesters/repositories/fakes/FakeClassesRepository';
import FakeSubjectsRepository from '@modules/subjects/repositories/fakes/FakeSubjectsRepository';
import FakeSubjectsStudentsRepository from '@modules/subjects/repositories/fakes/FakeSubjectsStudentsRepository';
import Role from '@modules/users/infra/typeorm/entities/Role';
import FakeStudentsRepository from '@modules/users/repositories/fakes/FakeStudentsRepository';
import FakeTeachersRepository from '@modules/users/repositories/fakes/FakeTeachersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeDownloadProvider from '@shared/container/providers/DownloadProvider/fakes/FakeDownloadProvider';
import FakeRecognitionProvider from '@shared/container/providers/RecognitionProvider/fakes/FakeRecognitionProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeRecognitionFilesRepository from '../repositories/fakes/FakeRecognitionFilesRepository';
import RecognitionService from './RecognitionService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTeachersRepository: FakeTeachersRepository;
let fakeSubjectsRepository: FakeSubjectsRepository;
let subjectsStudentsRepository: FakeSubjectsStudentsRepository;
let fakePhotosRepository: FakePhotosRepository;
let fakeClassesRepository: FakeClassesRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let fakeAttendancesRepository: FakeAttendancesRepository;
let fakeRecognitionProvider: FakeRecognitionProvider;
let fakeStorageProvider: FakeStorageProvider;
let fakeDownloadProvider: FakeDownloadProvider;
let fakeRecognitionFilesRepository: FakeRecognitionFilesRepository;
let recognitionService: RecognitionService;

describe('Recognition Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTeachersRepository = new FakeTeachersRepository();
    fakeSubjectsRepository = new FakeSubjectsRepository();
    subjectsStudentsRepository = new FakeSubjectsStudentsRepository();
    fakePhotosRepository = new FakePhotosRepository();
    fakeClassesRepository = new FakeClassesRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeAttendancesRepository = new FakeAttendancesRepository();
    fakeRecognitionProvider = new FakeRecognitionProvider();
    fakeStorageProvider = new FakeStorageProvider();
    fakeRecognitionFilesRepository = new FakeRecognitionFilesRepository();
    recognitionService = new RecognitionService(
      fakeSubjectsRepository,
      fakeClassesRepository,
      fakeStudentsRepository,
      fakeStorageProvider,
      fakeRecognitionProvider,
      fakeAttendancesRepository,
      fakeDownloadProvider,
      fakeRecognitionFilesRepository,
    );
  });

  // it('should be able to training a subject', async () => {
  //   const userTeacher = await fakeUsersRepository.create({
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //     password: '123123',
  //     role: Role.TEACHER,
  //   });

  //   const firstUserStudent = await fakeUsersRepository.create({
  //     name: 'First Student',
  //     email: 'first@student.com',
  //     password: '123123',
  //     role: Role.STUDENT,
  //   });

  //   const secondUserTeacher = await fakeUsersRepository.create({
  //     name: 'Second Student',
  //     email: 'second@student.com',
  //     password: '123123',
  //     role: Role.STUDENT,
  //   });

  //   const teacher = await fakeTeachersRepository.create({
  //     enrollment: '000000',
  //     user: userTeacher,
  //   });

  //   const firstStudent = await fakeStudentsRepository.create({
  //     enrollment: '111111',
  //     user: firstUserStudent,
  //   });

  //   const secondStudent = await fakeStudentsRepository.create({
  //     enrollment: '222222',
  //     user: secondUserTeacher,
  //   });

  //   await fakePhotosRepository.create({
  //     path: 'path-first-student',
  //     photoType: PhotoType.NORMAL,
  //     student: firstStudent,
  //   });

  //   await fakePhotosRepository.create({
  //     path: 'path-second-student',
  //     photoType: PhotoType.NORMAL,
  //     student: secondStudent,
  //   });

  //   const subject = await fakeSubjectsRepository.create({
  //     name: 'Subject',
  //     course: 'Course',
  //     description: 'Description',
  //     teacher,
  //   });

  //   await subjectsStudentsRepository.create({
  //     student: firstStudent,
  //     subject,
  //     isEnrolled: true,
  //   });

  //   await subjectsStudentsRepository.create({
  //     student: secondStudent,
  //     subject,
  //     isEnrolled: true,
  //   });

  //   const response = await recognitionService.training({
  //     subjectId: subject.id,
  //   });

  //   expect(response).toBe(true);
  // });

  it('should not be able to training subject if subject does not exists', async () => {
    expect(
      await recognitionService.training({
        subjectId: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to training subject if subject has only one student', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const firstUserStudent = await fakeUsersRepository.create({
      name: 'First Student',
      email: 'first@student.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const firstStudent = await fakeStudentsRepository.create({
      enrollment: '111111',
      user: firstUserStudent,
    });

    await fakePhotosRepository.create({
      path: 'path-first-student',
      photoType: PhotoType.NORMAL,
      student: firstStudent,
    });

    const subject = await fakeSubjectsRepository.create({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacher,
    });

    await subjectsStudentsRepository.create({
      student: firstStudent,
      subject,
      isEnrolled: true,
    });

    expect(
      await recognitionService.training({
        subjectId: subject.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to training subject if at least one student does not have photos', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const firstUserStudent = await fakeUsersRepository.create({
      name: 'First Student',
      email: 'first@student.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const secondUserTeacher = await fakeUsersRepository.create({
      name: 'Second Student',
      email: 'second@student.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const firstStudent = await fakeStudentsRepository.create({
      enrollment: '111111',
      user: firstUserStudent,
    });

    const secondStudent = await fakeStudentsRepository.create({
      enrollment: '222222',
      user: secondUserTeacher,
    });

    await fakePhotosRepository.create({
      path: 'path-first-student',
      photoType: PhotoType.NORMAL,
      student: firstStudent,
    });

    const subject = await fakeSubjectsRepository.create({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacher,
    });

    await subjectsStudentsRepository.create({
      student: firstStudent,
      subject,
      isEnrolled: true,
    });

    await subjectsStudentsRepository.create({
      student: secondStudent,
      subject,
      isEnrolled: true,
    });

    const response = await recognitionService.training({
      subjectId: subject.id,
    });

    expect(response).toBe(true);
  });
});
