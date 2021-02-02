import Role from '@modules/users/infra/typeorm/entities/Role';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStudentsRepository from '@modules/users/repositories/fakes/FakeStudentsRepository';
import FakeTeachersRepository from '@modules/users/repositories/fakes/FakeTeachersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/fakes/FakeQueryBuilderProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeSubjectsRepository from '../repositories/fakes/FakeSubjectsRepository';
import FakeSubjectsStudentsRepository from '../repositories/fakes/FakeSubjectsStudentsRepository';
import SubjectsService from './SubjectsService';

let fakeSubjectsRepository: FakeSubjectsRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeSubjectsStudentsRepository: FakeSubjectsStudentsRepository;
let fakeTeachersRepository: FakeTeachersRepository;
let fakeQueryBuilderProvider: FakeQueryBuilderProvider;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;

let subjectsService: SubjectsService;

describe('Default User Service', () => {
  beforeEach(() => {
    fakeSubjectsRepository = new FakeSubjectsRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeSubjectsStudentsRepository = new FakeSubjectsStudentsRepository();
    fakeTeachersRepository = new FakeTeachersRepository();
    fakeQueryBuilderProvider = new FakeQueryBuilderProvider();
    fakeHashProvider = new FakeHashProvider();
    fakeStorageProvider = new FakeStorageProvider();

    subjectsService = new SubjectsService(
      fakeSubjectsRepository,
      fakeStudentsRepository,
      fakeUsersRepository,
      fakeSubjectsStudentsRepository,
      fakeTeachersRepository,
      fakeQueryBuilderProvider,
      fakeHashProvider,
      fakeStorageProvider,
    );
  });

  it('should be able to list subjects', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    await fakeSubjectsRepository.create({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacher,
    });

    const subjects = await subjectsService.listSubjects({});

    expect(subjects.data.length).toBe(1);
  });

  it('should be able to list subjects by teacherId', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    await fakeSubjectsRepository.create({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacher,
    });

    const subjects = await subjectsService.listAllByTeacher(teacher.id, {});

    expect(subjects.data.length).toBe(1);
  });

  it('should not be able to create subject', async () => {
    expect(subjectsService.listAllByTeacher(0, {})).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should be able to show subject by id', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const subject = await fakeSubjectsRepository.create({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacher,
    });

    const findSubject = await subjectsService.showSubject(subject.id);

    expect(findSubject?.name).toBe('Subject');
  });

  it('should not be able to create subject', async () => {
    expect(subjectsService.showSubject(0)).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create subject', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const subject = await subjectsService.createSubject({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacherId: teacher.id,
    });

    expect(subject?.name).toBe('Subject');
  });

  it('should not be able to create subject if teacher does not exists', async () => {
    expect(
      subjectsService.createSubject({
        name: 'Subject',
        course: 'Course',
        description: 'Description',
        teacherId: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update subject', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const oldSubject = await subjectsService.createSubject({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacherId: teacher.id,
    });

    const newSubject = await subjectsService.updateSubject(oldSubject.id, {
      name: 'New Subject',
      course: 'Course',
      description: 'Description',
      teacherId: teacher.id,
    });

    expect(newSubject?.name).toBe('New Subject');
  });

  it('should be able to update subject if teacher does not exists', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const oldSubject = await subjectsService.createSubject({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacherId: teacher.id,
    });

    expect(
      subjectsService.updateSubject(oldSubject.id, {
        name: 'New Subject',
        course: 'Course',
        description: 'Description',
        teacherId: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete subject', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '000000',
      user: userTeacher,
    });

    const subject = await subjectsService.createSubject({
      name: 'Subject',
      course: 'Course',
      description: 'Description',
      teacherId: teacher.id,
    });

    await subjectsService.deleteSubject(subject.id);

    const subjectExists = await fakeSubjectsRepository.findById(subject.id);

    expect(subjectExists).toBeUndefined();
  });
});
