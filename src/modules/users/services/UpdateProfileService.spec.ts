import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import Role from '../infra/typeorm/entities/Role';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeStudentsRepository from '../repositories/fakes/FakeStudentsRepository';
import FakeTeachersRepository from '../repositories/fakes/FakeTeachersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStudentsRepository: FakeStudentsRepository;
let fakeTeachersRepository: FakeTeachersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('Update Profile Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeUsersRepository = new FakeUsersRepository();
    fakeStudentsRepository = new FakeStudentsRepository();
    fakeTeachersRepository = new FakeTeachersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeStudentsRepository,
      fakeTeachersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update teacher`s profile', async () => {
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

    const updatedUser = await updateProfileService.updateTeacherProfile(
      teacher.id,
      {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
        oldPassword: '123123',
      },
    );
    expect(updatedUser.name).toBe('New name');
    expect(updatedUser.email).toBe('newemail@test.com');
  });

  it('should be able to update teacher`s profile with out password', async () => {
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

    const updatedUser = await updateProfileService.updateTeacherProfile(
      teacher.id,
      {
        name: 'New name',
        email: 'newemail@test.com',
      },
    );
    expect(updatedUser.name).toBe('New name');
    expect(updatedUser.email).toBe('newemail@test.com');
  });

  it('should not be able to update teacher`s profile if teacher does not exists', async () => {
    expect(
      updateProfileService.updateTeacherProfile(0, {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
        oldPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update teacher`s profile if old password does not exists', async () => {
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

    expect(
      updateProfileService.updateTeacherProfile(teacher.id, {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update teacher`s profile if wrong old password', async () => {
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

    expect(
      updateProfileService.updateTeacherProfile(teacher.id, {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
        oldPassword: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update student`s profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const updatedUser = await updateProfileService.updateStudentProfile(
      student.id,
      {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
        oldPassword: '123123',
      },
    );
    expect(updatedUser.name).toBe('New name');
    expect(updatedUser.email).toBe('newemail@test.com');
  });

  it('should be able to update student`s profile with out password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    const updatedUser = await updateProfileService.updateStudentProfile(
      student.id,
      {
        name: 'New name',
        email: 'newemail@test.com',
      },
    );
    expect(updatedUser.name).toBe('New name');
    expect(updatedUser.email).toBe('newemail@test.com');
  });

  it('should not be able to update student`s profile if student does not exists', async () => {
    expect(
      updateProfileService.updateStudentProfile(0, {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
        oldPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update student`s profile if old password does not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    expect(
      updateProfileService.updateStudentProfile(student.id, {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update student`s profile if wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user,
    });

    expect(
      updateProfileService.updateStudentProfile(student.id, {
        name: 'New name',
        email: 'newemail@test.com',
        password: '123456',
        oldPassword: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
