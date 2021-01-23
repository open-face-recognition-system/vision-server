import ICreateRecognitionFileDOT from '../dtos/ICreateRecognitionFileDOT';
import RecognitionFile from '../infra/typeorm/entities/RecognitionFile';

export default interface IRecognitionFilesRepository {
  findByPath(path: string): Promise<RecognitionFile | undefined>;
  create(recognitionFile: ICreateRecognitionFileDOT): Promise<RecognitionFile>;
  delete(id: number): Promise<void>;
  save(recognitionFile: RecognitionFile): Promise<RecognitionFile>;
}
