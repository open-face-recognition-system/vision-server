import PDFParser, { Page as PdfPage } from 'pdf2json';
import Student from '@modules/users/infra/typeorm/entities/Student';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import IQueryBuilderProvider from '@shared/container/providers/QueryBuilderProvider/models/IQueryBuilderProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Pagination from '@shared/dtos/Pagination';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import uploadConfig from '@config/upload';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import Role from '@modules/users/infra/typeorm/entities/Role';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import Subject from '../infra/typeorm/entities/Subject';
import ISubjectsRepository from '../repositories/ISubjectsRepository';
import ISubjectsStudentsRepository from '../repositories/ISubjectsStudentsRepository';

interface IRequest {
  name: string;
  description: string;
  course: string;
  teacherId: number;
}

interface StudentAux {
  name: string;
  email: string;
  enrollment: string;
}

@injectable()
class SubjectsService {
  private subjectsRepository: ISubjectsRepository;

  private studentsRepository: IStudentsRepository;

  private usersRepository: IUsersRepository;

  private subjectsStudentsRepository: ISubjectsStudentsRepository;

  private teachersRepository: ITeachersRepository;

  private queryBuilderProvider: IQueryBuilderProvider;

  private hashProvider: IHashProvider;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('SubjectsRepository')
    subjectsRepository: ISubjectsRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('SubjectsStudentsRepository')
    subjectsStudentsRepository: ISubjectsStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
    @inject('QueryBuilderProvider')
    queryBuilderProvider: IQueryBuilderProvider,
    @inject('HashProvider')
    hashProvider: IHashProvider,
    @inject('StorageProvider')
    storageProvider: IStorageProvider,
  ) {
    this.subjectsRepository = subjectsRepository;
    this.studentsRepository = studentsRepository;
    this.usersRepository = usersRepository;
    this.subjectsStudentsRepository = subjectsStudentsRepository;
    this.teachersRepository = teachersRepository;
    this.queryBuilderProvider = queryBuilderProvider;
    this.hashProvider = hashProvider;
    this.storageProvider = storageProvider;
  }

  public async listSubjects(query: any): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    const subjects = await this.subjectsRepository.findAllWithPagination(built);
    return subjects;
  }

  public async showSubject(id: number): Promise<Subject | undefined> {
    const subject = await this.subjectsRepository.findById(id);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    return subject;
  }

  public async createSubject({
    name,
    description,
    course,
    teacherId,
  }: IRequest): Promise<Subject> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subject = await this.subjectsRepository.create({
      name,
      description,
      course,
      teacher,
    });
    return subject;
  }

  public getPdfPath(filename: string) {
    return `${uploadConfig.tmpFolder}/${filename}`;
  }

  public async createAndEnrollStudentsByPdf(
    id: number,
    filename: string,
  ): Promise<Student[]> {
    const subject = await this.subjectsRepository.findById(id);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    try {
      const pages = await this.readPdfPages(this.getPdfPath(filename));
      const enrolledStudents: Student[] = [];

      for (const student of pages.flatMap(page => this.parseStudents(page.Texts))) {
        enrolledStudents.push(await this.enrollOrCreateStudent(student, subject));
      }

      return enrolledStudents;
    } finally {
      await this.storageProvider.deleteTmpFile(filename);
    }
  }

  private readPdfPages(pdfPath: string): Promise<PdfPage[]> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataReady', data => resolve(data.Pages));
      pdfParser.on('pdfParser_dataError', () => reject(new AppError('Invalid enrollment PDF')));
      pdfParser.loadPDF(pdfPath);
    });
  }

  private parseStudents(texts: PdfPage['Texts']): StudentAux[] {
    const text = (index: number) => texts[index].R[0].T.trim();
    const students: StudentAux[] = [];

    for (let i = 14; i + 5 < texts.length; ) {
      const emailContinues = !this.hasNumbers(text(i + 5));
      students.push({
        name: text(i),
        enrollment: text(i + 1),
        email: emailContinues ? text(i + 4) + text(i + 5) : text(i + 4),
      });
      i += emailContinues ? 7 : 6;
    }

    return students;
  }

  private hasNumbers(text: string): boolean {
    return /^[+-]?((\d+)?\d(.\d*)?|.\d+)$/.test(text.trim());
  }

  public async updateSubject(
    id: number,
    { name, description, course, teacherId }: IRequest,
  ): Promise<Subject> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subject = await this.subjectsRepository.save({
      id,
      name,
      description,
      course,
      teacher,
    });

    return subject;
  }

  public async deleteSubject(id: number): Promise<void> {
    await this.subjectsRepository.delete(id);
  }

  public async enrollOrCreateStudent(
    studentAux: StudentAux,
    subject: Subject,
  ): Promise<Student> {
    const { name, email, enrollment } = studentAux;
    let student = await this.studentsRepository.findByEnrollment(enrollment);
    const hashedPassword = await this.hashProvider.generateHash('123123');

    if (!student) {
      const user = await this.usersRepository.create({
        name,
        email,
        password: hashedPassword,
        role: Role.STUDENT,
      });

      student = await this.studentsRepository.create({
        user,
        enrollment,
      });
    }

    const studentAlreadyEnrolled = await this.subjectsStudentsRepository.findByStudent(
      subject,
      student,
    );

    if (studentAlreadyEnrolled && !studentAlreadyEnrolled.isEnrolled) {
      await this.subjectsStudentsRepository.save({
        id: studentAlreadyEnrolled.id,
        isEnrolled: true,
        subject,
        student,
      });
    } else if (!studentAlreadyEnrolled) {
      await this.subjectsStudentsRepository.create({
        isEnrolled: true,
        subject,
        student,
      });
    }

    return student;
  }

  public async enrollStudent(
    subjectId: number,
    studentId: number,
  ): Promise<Student> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const studentAlreadyEnrolled = await this.subjectsStudentsRepository.findByStudent(
      subject,
      student,
    );

    if (studentAlreadyEnrolled && studentAlreadyEnrolled.isEnrolled) {
      throw new AppError('Student already enrolled');
    }

    if (studentAlreadyEnrolled && !studentAlreadyEnrolled.isEnrolled) {
      await this.subjectsStudentsRepository.save({
        id: studentAlreadyEnrolled.id,
        isEnrolled: true,
        subject,
        student,
      });
    } else {
      await this.subjectsStudentsRepository.create({
        isEnrolled: true,
        subject,
        student,
      });
    }

    return student;
  }

  public async unenrollStudent(
    subjectId: number,
    studentId: number,
  ): Promise<void> {
    const subject = await this.subjectsRepository.findById(subjectId);

    if (!subject) {
      throw new AppError('Subject does not exists');
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      throw new AppError('Student does not exists');
    }

    const studentAlreadyEnrolled = await this.subjectsStudentsRepository.findByStudent(
      subject,
      student,
    );

    if (!studentAlreadyEnrolled) {
      throw new AppError('Student does not enrolled on this subject');
    }

    await this.subjectsStudentsRepository.save({
      id: studentAlreadyEnrolled.id,
      isEnrolled: false,
      subject,
      student,
    });
  }

  public async listAllByTeacher(
    teacherId: number,
    query: any,
  ): Promise<Pagination> {
    const built = this.queryBuilderProvider.buildQuery(query);
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError('Teacher does not exists');
    }

    const subjects = await this.subjectsRepository.findAllByTeacherId(
      teacherId,
      built,
    );

    return subjects;
  }
}

export default SubjectsService;
