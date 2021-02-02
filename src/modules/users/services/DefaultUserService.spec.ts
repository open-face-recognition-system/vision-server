import FakeStudentsRepository from '@modules/users/repositories/fakes/FakeStudentsRepository';
import FakeQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/fakes/FakeQueryBuilderProvider';
import AppError from '@shared/errors/AppError';
import Role from '../infra/typeorm/entities/Role';
import FakeTeachersRepository from '../repositories/fakes/FakeTeachersRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import DefaultUserService from './DefaultUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let fakeTeachersRepository: FakeTeachersRepository;
let fakeQueryBuilderProvider: FakeQueryBuilderProvider;
let defaultUserService: DefaultUserService;

describe('Default User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeTeachersRepository = new FakeTeachersRepository();
    fakeQueryBuilderProvider = new FakeQueryBuilderProvider();

    defaultUserService = new DefaultUserService(
      fakeUsersRepository,
      fakeStudentsRepository,
      fakeTeachersRepository,
      fakeQueryBuilderProvider,
    );
  });

  it('should be able to list sutudent by id', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const findStudent = await defaultUserService.findStudentById(student.id);

    expect(findStudent.user.name).toBe(student.user.name);
  });

  it('should not be able to list teacher by if if teacher does not exists', async () => {
    expect(defaultUserService.findStudentById(0)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should be able to list sutudent by id', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const teacher = await fakeTeachersRepository.create({
      enrollment: '123123',
      user,
    });

    const findStudent = await defaultUserService.findTeacherById(teacher.id);

    expect(findStudent.user.name).toBe(teacher.user.name);
  });

  it('should not be able to list teacher by if if teacher does not exists', async () => {
    expect(defaultUserService.findTeacherById(0)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should be able to list all students by name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const query = {
      name: 'John Doe',
    };

    const students = await defaultUserService.findAllStudents(query);

    expect(students.data.length).toBe(1);
  });

  it('should be able to list all students with no query', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const students = await defaultUserService.findAllStudents({});

    expect(students.data.length).toBe(1);
  });

  it('should be able to list all teachers by name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    await fakeTeachersRepository.create({
      enrollment: '123123',
      user,
    });

    const query = {
      name: 'John Doe',
    };

    const teachers = await defaultUserService.findAllTeachers(query);

    expect(teachers.data.length).toBe(1);
  });

  it('should be able to list all teachers with no query', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    await fakeTeachersRepository.create({
      enrollment: '123123',
      user,
    });

    const teachers = await defaultUserService.findAllTeachers({});

    expect(teachers.data.length).toBe(1);
  });

  it('should be able to update student', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const { id } = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const student = await defaultUserService.updateStudent(id, {
      name: 'New Name',
      email: user.email,
    });

    expect(student.name).toBe('New Name');
  });

  it('should not be able to update student if student does not exists', async () => {
    expect(
      defaultUserService.updateStudent(0, { name: 'test', email: 'email' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update teacher', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    const { id } = await fakeTeachersRepository.create({
      enrollment: '123123',
      user,
    });

    const teacher = await defaultUserService.updateTeacher(id, {
      name: 'New Name',
      email: user.email,
    });

    expect(teacher.name).toBe('New Name');
  });

  it('should not be able to update teacher if teacher does not exists', async () => {
    expect(
      defaultUserService.updateTeacher(0, { name: 'test', email: 'email' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.STUDENT,
    });

    await defaultUserService.deleteUser(user.id);

    const userExists = await fakeUsersRepository.findById(user.id);

    expect(userExists).toBeUndefined();
  });
});
