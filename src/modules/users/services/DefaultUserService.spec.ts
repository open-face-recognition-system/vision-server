import FakeStudentsRepository from '../repositories/fakes/FakeStudentsRepository';
import DefaultUserService from './DefaultUserService';

let fakeStudentsRepository: FakeStudentsRepository;
let defaultUserService: DefaultUserService;

describe('DefaultUserService', () => {
  beforeEach(() => {
    fakeStudentsRepository = new FakeStudentsRepository();

    defaultUserService = new DefaultUserService(fakeStudentsRepository);
  });

  it('should be able list all students', async () => {
    const students = await defaultUserService.findAllStudents(10, 0);

    expect(students.length).toBe(0);
  });
});
