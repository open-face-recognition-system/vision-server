import ICreateRecognitionFileDOT from '../dtos/ICreateRecognitionFileDOT';
import RecognitionFile from '../infra/typeorm/entities/RecognitionFile';

export default interface IRecognitionFilesRepository {
  findByPath(path: string): Promise<RecognitionFile | undefined>;
  create(photo: ICreateRecognitionFileDOT): Promise<RecognitionFile>;
  delete(id: number): Promise<void>;
  save(photo: RecognitionFile): Promise<RecognitionFile>;
}
