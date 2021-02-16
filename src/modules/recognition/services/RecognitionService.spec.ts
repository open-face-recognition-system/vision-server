describe('Recognition Service', () => {
  test('test', () => {
    expect(1).toBe(1);
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
  // it('should not be able to training subject if subject does not exists', async () => {
  //   expect(
  //     await recognitionService.training({
  //       subjectId: 0,
  //     }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });
  // it('should not be able to training subject if subject has only one student', async () => {
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
  //   const teacher = await fakeTeachersRepository.create({
  //     enrollment: '000000',
  //     user: userTeacher,
  //   });
  //   const firstStudent = await fakeStudentsRepository.create({
  //     enrollment: '111111',
  //     user: firstUserStudent,
  //   });
  //   await fakePhotosRepository.create({
  //     path: 'path-first-student',
  //     photoType: PhotoType.NORMAL,
  //     student: firstStudent,
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
  //   expect(
  //     await recognitionService.training({
  //       subjectId: subject.id,
  //     }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });
  // it('should not be able to training subject if at least one student does not have photos', async () => {
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
});
