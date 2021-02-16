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
          name: 'Ana Cristina Vasconcellos Reinert',
          email: 'anacr.vasconcellos@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012027',
      },
      {
        user: {
          name: 'André Ellias Zanella',
          email: 'andreellias18@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012019',
      },
      {
        user: {
          name: 'Andre Rodrigo Frainer',
          email: 'andre_frainer@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011931',
      },
      {
        user: {
          name: 'Augusto Rustick',
          email: 'gameeend00@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012010',
      },
      {
        user: {
          name: 'Bruce Vinicius Moraes Vahldick',
          email: 'brucev.br@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012012',
      },
      {
        user: {
          name: 'Bruno Espindola',
          email: 'brunoespindola.work@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012025',
      },
      {
        user: {
          name: 'Carlos Henrique Tenfen',
          email: 'carlos.henrique.tenfen@outlook.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021927',
      },
      {
        user: {
          name: 'David Henrique Cardoso May',
          email: 'davidhcmay0@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012031',
      },
      {
        user: {
          name: 'Denis Zickuhr',
          email: 'coringatheboss@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012011',
      },
      {
        user: {
          name: 'Eduardo Henrique Horstmann',
          email: 'eduardohorstmann@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021728',
      },
      {
        user: {
          name: 'Gabriel Antonio Bertoldi Perini',
          email: 'gabrielperini16@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012015',
      },
      {
        user: {
          name: 'Gabriel Antunes de Oliveira',
          email: 'gabriel-antunes13@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021723',
      },
      {
        user: {
          name: 'Gabriel Dolzan',
          email: 'gabriel.dolzan@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012004',
      },
      {
        user: {
          name: 'Guilherme Luiz Lange',
          email: 'gui.luizlange@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012016',
      },
      {
        user: {
          name: 'Gustavo Rodrigues de Lima',
          email: 'gugarodrigueslima72@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011933',
      },
      {
        user: {
          name: 'Henrique Pereira Ehing',
          email: 'hiqueehing@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012021',
      },
      {
        user: {
          name: 'Igor Antunes Ochner',
          email: 'igor_ochner@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012033',
      },
      {
        user: {
          name: 'Jackson Castilho da Luz',
          email: 'udescjacksoncastilho@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021924',
      },
      {
        user: {
          name: 'Jerônimo Santiago Floriani Filho',
          email: 'jefloriani@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012009',
      },
      {
        user: {
          name: 'João Antonio Oliveira da Silva',
          email: 'jhow.antonio3@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011723',
      },
      {
        user: {
          name: 'João Victor Koch',
          email: 'joao@kllic.com.br',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021903',
      },
      {
        user: {
          name: 'João Víttor da Silva Kuhn',
          email: 'jvskuhn@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012008',
      },
      {
        user: {
          name: 'Julia Moura de Morais Sales',
          email: 'juliamdmsales@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021907',
      },
      {
        user: {
          name: 'Julio Cesar Bueno de Oliveira Junior',
          email: 'juliumnix@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012018',
      },
      {
        user: {
          name: 'Lucas Moraes Schwambach',
          email: 'lucas.schwambach52@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012007',
      },
      {
        user: {
          name: 'Lucas Stefan Sautner Gerber',
          email: 'lucas.sautner.gerber@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011919',
      },
      {
        user: {
          name: 'Luis Felipe da Silva',
          email: 'luis_felipes14@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012017',
      },
      {
        user: {
          name: 'Luís Felipe Küster',
          email: 'luis.felipe.kuster17@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012023',
      },
      {
        user: {
          name: 'Marcos Brandt Junior',
          email: 'marcosbrandtjunior@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012032',
      },
      {
        user: {
          name: 'Mateus Coelho Nosse',
          email: 'mateusnosse97@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012005',
      },
      {
        user: {
          name: 'Mateus Lucas Cruz Brandt',
          email: 'mateuxlucax@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012001',
      },
      {
        user: {
          name: 'Matheus de Castro Lima Teixeira',
          email: 'matheusportinho12@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021908',
      },
      {
        user: {
          name: 'Matheus Trindade Varella do Nascimento',
          email: 'matheustvn2808@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021912',
      },
      {
        user: {
          name: 'Murilo Antunes Goedert',
          email: 'murilogoedert@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012026',
      },
      {
        user: {
          name: 'Pedro Lucas Copatti',
          email: 'pedrolucascopatti@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012024',
      },
      {
        user: {
          name: 'Renan Ricardo Holler',
          email: 'rrholler@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021712',
      },
      {
        user: {
          name: 'Ryan Arthur Brassiani',
          email: 'brassianiifc@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012030',
      },
      {
        user: {
          name: 'Victor Hugo Grabowski Beltramini',
          email: 'vhbeltramini@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105012028',
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
          name: 'Felipe Rohr Hoinoski',
          email: 'felipehoinoski@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011719',
      },
      {
        user: {
          name: 'Guilherme Rafael Deschamps',
          email: 'guilhermerd6@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011811',
      },
      {
        user: {
          name: 'Rodrigo Valle',
          email: 'digo.valle09@yahoo.com.br',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021707',
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
          name: 'Alexander Felipe Chiudini Ristow',
          email: 'alexchiudini96@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021608',
      },
      {
        user: {
          name: 'Brenda Paetzoldt Silva',
          email: 'brendapaetzoldt@yahoo.com.br',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011604',
      },
      {
        user: {
          name: 'Bruno Zilli Sgrott',
          email: 'brunozsgrott@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011733',
      },
      {
        user: {
          name: 'Giancarlo Pandini',
          email: 'giancarlopandini@yahoo.com.br',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021735',
      },
      {
        user: {
          name: 'Gustavo Jose Salvalaggio',
          email: 'gustavoj.salvalaggio@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021708',
      },
      {
        user: {
          name: 'José Carlos Bernardes Brümmer',
          email: 'josecarlosb.brummer@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011705',
      },
      {
        user: {
          name: 'José Vargas Nolli',
          email: 'jvargasnolli@yahoo.com.br',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021706',
      },
      {
        user: {
          name: 'Kananda Raquel Mayer',
          email: 'kanandamayer@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011415',
      },
      {
        user: {
          name: 'Leonardo Tadeu Jaques Steinke',
          email: 'leonardosteinke1@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011730',
      },
      {
        user: {
          name: 'Luís Roberto Weck',
          email: 'luisrweck@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021512',
      },
      {
        user: {
          name: 'Rafael de Miranda',
          email: 'rafael.demiranda95@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011932',
      },
      {
        user: {
          name: 'Robert Willian Krambeck',
          email: 'robertwilliankrambeck@hotmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011724',
      },
      {
        user: {
          name: 'Rodrigo Souza Tassoni',
          email: 'tazzsoni@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011818',
      },
      {
        user: {
          name: 'Ruan Felipe Maçaneiro',
          email: 'rf9contato@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105021423',
      },
      {
        user: {
          name: 'Vinícius Catafesta Francisco',
          email: 'vini.ibi@gmail.com',
          password: '123123',
          role: 'student',
        },
        enrollment: '5105011736',
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
    expect(
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

    expect(subjectsService.enrollStudent(0, student.id)).rejects.toBeInstanceOf(
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

    expect(subjectsService.enrollStudent(subject.id, 0)).rejects.toBeInstanceOf(
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

    expect(
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

    expect(
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

    expect(
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

    expect(
      subjectsService.enrollStudent(subject.id, student.id),
    ).rejects.toBeInstanceOf(AppError);
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

    expect(
      subjectsService.enrollStudent(subject.id, student.id),
    ).rejects.toBeInstanceOf(AppError);
  });
});
