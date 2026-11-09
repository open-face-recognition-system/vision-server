import path from 'path';
import uploadConfig from '@config/upload';
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
    await expect(subjectsService.listAllByTeacher(0, {})).rejects.toBeInstanceOf(
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
    await expect(subjectsService.showSubject(0)).rejects.toBeInstanceOf(AppError);
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
    await expect(
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

    await expect(
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

  it('should parse pdf1', async () => {
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

    const pdfPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tests',
      'resources',
    );

    const spy = jest.spyOn(subjectsService, 'getPdfPath');
    spy.mockReturnValue(`${pdfPath}/pdf1.pdf`);
    const students = await subjectsService.createAndEnrollStudentsByPdf(
      subject.id,
      'pdf1.pdf',
    );

    const expectedStudents = [
      {
        user: {
          name: 'Marina Vasconcelos Lacerda',
          email: 'marina.vasconcelos.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '3077915447',
      },
      {
        user: {
          name: 'Carla Ferraz Ferraz',
          email: 'carla.ferraz.ferraz@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0184087139',
      },
      {
        user: {
          name: 'Yasmin Rezende Lacerda',
          email: 'yasmin.rezende.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8556133777',
      },
      {
        user: {
          name: 'Diego Vasconcelos Holanda',
          email: 'diego.vasconcelos.holanda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '7742400833',
      },
      {
        user: {
          name: 'Fabio Holanda Pacheco',
          email: 'fabio.holanda.pacheco@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '6954041129',
      },
      {
        user: {
          name: 'Olivia Holanda Moreira',
          email: 'olivia.holanda.moreira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2664626297',
      },
      {
        user: {
          name: 'Joao Duarte Oliveira',
          email: 'joao.duarte.oliveira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0784511816',
      },
      {
        user: {
          name: 'Karina Moreira Duarte',
          email: 'karina.moreira.duarte@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1262532110',
      },
      {
        user: {
          name: 'Karina Nogueira Vasconcelos',
          email: 'karina.nogueira.vasconcelos@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0840896210',
      },
      {
        user: {
          name: 'Ana Queiroz Nogueira',
          email: 'ana.queiroz.nogueira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0968758349',
      },
      {
        user: {
          name: 'Rafaela Lacerda Nogueira',
          email: 'rafaela.lacerda.nogueira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2695862851',
      },
      {
        user: {
          name: 'Fabio Holanda Almeida',
          email: 'fabio.holanda.almeida@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '9782973588',
      },
      {
        user: {
          name: 'Fabio Barbosa Nogueira',
          email: 'fabio.barbosa.nogueira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8242530540',
      },
      {
        user: {
          name: 'Gabriela Queiroz Moreira',
          email: 'gabriela.queiroz.moreira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1426870351',
      },
      {
        user: {
          name: 'Olivia Esteves Lacerda',
          email: 'olivia.esteves.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5164398047',
      },
      {
        user: {
          name: 'Paulo Machado Rezende',
          email: 'paulo.machado.rezende@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '6746886082',
      },
      {
        user: {
          name: 'Joao Oliveira Lacerda',
          email: 'joao.oliveira.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4930494611',
      },
      {
        user: {
          name: 'Caio Almeida Holanda',
          email: 'caio.almeida.holanda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '6842799831',
      },
      {
        user: {
          name: 'Yasmin Esteves Lacerda',
          email: 'yasmin.esteves.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '9478467918',
      },
      {
        user: {
          name: 'Caio Esteves Esteves',
          email: 'caio.esteves.esteves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2552375702',
      },
      {
        user: {
          name: 'Samuel Esteves Goncalves',
          email: 'samuel.esteves.goncalves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5527372207',
      },
      {
        user: {
          name: 'Paulo Ferraz Almeida',
          email: 'paulo.ferraz.almeida@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0372866597',
      },
      {
        user: {
          name: 'Bruno Cardoso Esteves',
          email: 'bruno.cardoso.esteves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '3930509352',
      },
      {
        user: {
          name: 'Joao Holanda Moreira',
          email: 'joao.holanda.moreira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4763268089',
      },
      {
        user: {
          name: 'Bruno Rezende Esteves',
          email: 'bruno.rezende.esteves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '9377842380',
      },
      {
        user: {
          name: 'Pedro Almeida Machado',
          email: 'pedro.almeida.machado@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2519523942',
      },
      {
        user: {
          name: 'Bruno Rezende Duarte',
          email: 'bruno.rezende.duarte@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4671918053',
      },
      {
        user: {
          name: 'Vitor Duarte Vasconcelos',
          email: 'vitor.duarte.vasconcelos@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1460445389',
      },
      {
        user: {
          name: 'Gabriela Cardoso Pires',
          email: 'gabriela.cardoso.pires@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8717961357',
      },
      {
        user: {
          name: 'Bruno Nogueira Barbosa',
          email: 'bruno.nogueira.barbosa@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8569889645',
      },
      {
        user: {
          name: 'Carla Pacheco Esteves',
          email: 'carla.pacheco.esteves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2746662617',
      },
      {
        user: {
          name: 'Bruno Esteves Machado',
          email: 'bruno.esteves.machado@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '7001288532',
      },
      {
        user: {
          name: 'Gabriela Queiroz Rezende',
          email: 'gabriela.queiroz.rezende@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5756082333',
      },
      {
        user: {
          name: 'Laura Barbosa Esteves',
          email: 'laura.barbosa.esteves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0060761999',
      },
      {
        user: {
          name: 'Lucas Duarte Queiroz',
          email: 'lucas.duarte.queiroz@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1288929304',
      },
      {
        user: {
          name: 'Elisa Duarte Queiroz',
          email: 'elisa.duarte.queiroz@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8819665185',
      },
      {
        user: {
          name: 'Samuel Pires Pires',
          email: 'samuel.pires.pires@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '3825799800',
      },
      {
        user: {
          name: 'Olivia Vasconcelos Pacheco',
          email: 'olivia.vasconcelos.pacheco@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '7817117741',
      },
    ];

    students.forEach((student, index) => {
      expect(student.user.name).toBe(expectedStudents[index].user.name);
      expect(student.user.email).toBe(expectedStudents[index].user.email);
      expect(student.enrollment).toBe(expectedStudents[index].enrollment);
    });
  });

  it('should parse pdf2', async () => {
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

    const pdfPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tests',
      'resources',
    );

    const spy = jest.spyOn(subjectsService, 'getPdfPath');
    spy.mockReturnValue(`${pdfPath}/pdf2.pdf`);
    const students = await subjectsService.createAndEnrollStudentsByPdf(
      subject.id,
      'pdf2.pdf',
    );

    const expectedStudents = [
      {
        user: {
          name: 'Elisa Teixeira Moreira',
          email: 'elisa.teixeira.moreira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4758929118',
      },
      {
        user: {
          name: 'Gabriela Oliveira Moreira',
          email: 'gabriela.oliveira.moreira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1631813381',
      },
      {
        user: {
          name: 'Isabela Cardoso Ferraz',
          email: 'isabela.cardoso.ferraz@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2661246927',
      },
    ];

    students.forEach((student, index) => {
      expect(student.user.name).toBe(expectedStudents[index].user.name);
      expect(student.user.email).toBe(expectedStudents[index].user.email);
      expect(student.enrollment).toBe(expectedStudents[index].enrollment);
    });
  });

  it('should parse pdf3', async () => {
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

    const pdfPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tests',
      'resources',
    );

    const spy = jest.spyOn(subjectsService, 'getPdfPath');
    spy.mockReturnValue(`${pdfPath}/pdf3.pdf`);
    const students = await subjectsService.createAndEnrollStudentsByPdf(
      subject.id,
      'pdf3.pdf',
    );

    const expectedStudents = [
      {
        user: {
          name: 'Laura Lacerda Rezende',
          email: 'laura.lacerda.rezende@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4997736493',
      },
      {
        user: {
          name: 'Carla Rezende Oliveira',
          email: 'carla.rezende.oliveira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5921282102',
      },
      {
        user: {
          name: 'Fabio Siqueira Nogueira',
          email: 'fabio.siqueira.nogueira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8150716554',
      },
      {
        user: {
          name: 'Elisa Duarte Lacerda',
          email: 'elisa.duarte.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4721693202',
      },
      {
        user: {
          name: 'Diego Rezende Lacerda',
          email: 'diego.rezende.lacerda@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '6325663024',
      },
      {
        user: {
          name: 'Heitor Esteves Pacheco',
          email: 'heitor.esteves.pacheco@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1458803652',
      },
      {
        user: {
          name: 'Paulo Holanda Pacheco',
          email: 'paulo.holanda.pacheco@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0945763010',
      },
      {
        user: {
          name: 'Karina Pires Pires',
          email: 'karina.pires.pires@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '2561417917',
      },
      {
        user: {
          name: 'Bruno Moreira Goncalves',
          email: 'bruno.moreira.goncalves@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '8945259883',
      },
      {
        user: {
          name: 'Karina Moreira Queiroz',
          email: 'karina.moreira.queiroz@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '6056865042',
      },
      {
        user: {
          name: 'Yasmin Duarte Teixeira',
          email: 'yasmin.duarte.teixeira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4244686442',
      },
      {
        user: {
          name: 'Laura Queiroz Rezende',
          email: 'laura.queiroz.rezende@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '1333951211',
      },
      {
        user: {
          name: 'Laura Siqueira Vasconcelos',
          email: 'laura.siqueira.vasconcelos@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '4129566877',
      },
      {
        user: {
          name: 'Rafaela Almeida Oliveira',
          email: 'rafaela.almeida.oliveira@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '0291151355',
      },
      {
        user: {
          name: 'Marina Nogueira Pires',
          email: 'marina.nogueira.pires@example.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '3790482694',
      },
    ];

    students.forEach((student, index) => {
      expect(student.user.name).toBe(expectedStudents[index].user.name);
      expect(student.user.email).toBe(expectedStudents[index].user.email);
      expect(student.enrollment).toBe(expectedStudents[index].enrollment);
    });
  });

  it('should parse pdf2 with exists students', async () => {
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

    const pdfPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tests',
      'resources',
    );

    const spy = jest.spyOn(subjectsService, 'getPdfPath');
    spy.mockReturnValue(`${pdfPath}/pdf2.pdf`);
    await subjectsService.createAndEnrollStudentsByPdf(subject.id, 'pdf2.pdf');

    const students = await subjectsService.createAndEnrollStudentsByPdf(
      subject.id,
      'pdf2.pdf',
    );

    expect(students.length).toBe(3);
  });

  it('should parse pdf2 with exists students and unrolled student', async () => {
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

    const pdfPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tests',
      'resources',
    );

    const spy = jest.spyOn(subjectsService, 'getPdfPath');
    spy.mockReturnValue(`${pdfPath}/pdf2.pdf`);
    const studentsToEnroll = await subjectsService.createAndEnrollStudentsByPdf(
      subject.id,
      'pdf2.pdf',
    );

    await subjectsService.unenrollStudent(subject.id, studentsToEnroll[0].id);

    const students = await subjectsService.createAndEnrollStudentsByPdf(
      subject.id,
      'pdf2.pdf',
    );

    expect(students.length).toBe(3);
  });

  it('should return path', async () => {
    expect(subjectsService.getPdfPath('pdfPath')).toBe(
      `${uploadConfig.tmpFolder}/pdfPath`,
    );
  });

  it('should not parse pdf2 with no exists subject', async () => {
    await expect(
      subjectsService.createAndEnrollStudentsByPdf(0, 'pdf2.pdf'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should enroll student', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const userStudent = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user: userStudent,
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

    const enrolledStudent = await subjectsService.enrollStudent(
      subject.id,
      student.id,
    );

    expect(enrolledStudent.enrollment).toBe(student.enrollment);
  });

  it('should not be able to enroll student if subject does not eixsts', async () => {
    const userStudent = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user: userStudent,
    });

    await expect(subjectsService.enrollStudent(0, student.id)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to enroll student if student does not eixsts', async () => {
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

    await expect(subjectsService.enrollStudent(subject.id, 0)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to unenroll student if subject does not eixsts', async () => {
    const userStudent = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user: userStudent,
    });

    await expect(
      subjectsService.unenrollStudent(0, student.id),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to unenroll student if student does not eixsts', async () => {
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

    await expect(
      subjectsService.unenrollStudent(subject.id, 0),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to unenroll student if student does not enrolled', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const userStudent = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user: userStudent,
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

    await expect(
      subjectsService.unenrollStudent(subject.id, student.id),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to enroll the student if the student is unenrolled', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const userStudent = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user: userStudent,
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

    await subjectsService.enrollStudent(subject.id, student.id);
    await subjectsService.unenrollStudent(subject.id, student.id);

    await expect(
      subjectsService.enrollStudent(subject.id, student.id),
    ).resolves.toBe(student);
  });

  it('should not be able to enroll student if student is already enrolled', async () => {
    const userTeacher = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.TEACHER,
    });

    const userStudent = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      role: Role.ADMIN,
    });

    const student = await fakeStudentsRepository.create({
      enrollment: '123123',
      user: userStudent,
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

    await subjectsService.enrollStudent(subject.id, student.id);

    await expect(
      subjectsService.enrollStudent(subject.id, student.id),
    ).rejects.toBeInstanceOf(AppError);
  });
});
