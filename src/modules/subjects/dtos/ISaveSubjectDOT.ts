import RecognitionFile from '@modules/recognition/infra/typeorm/entities/RecognitionFile';
import Student from '@modules/users/infra/typeorm/entities/Student';
import Teacher from '@modules/users/infra/typeorm/entities/Teacher';

export default interface ISaveSubjectDOT {
  id: number;
  name?: string;
  description?: string;
  course?: string;
  teacher?: Teacher;
  students?: Student[];
  recognitionFile?: RecognitionFile;
}
