import ICreateRecognitionFileDOT from '@modules/recognition/dtos/ICreateRecognitionFileDOT';
import RecognitionFile from '@modules/recognition/infra/typeorm/entities/RecognitionFile';
import IRecognitionFilesRepository from '../IRecognitionFilesRepository';

class FakeRecognitionFilesRepository implements IRecognitionFilesRepository {
  private recognitionFiles: RecognitionFile[] = [];

  public async findByPath(path: string): Promise<RecognitionFile | undefined> {
    const recognitionFile = this.recognitionFiles.find(
      currentFile => currentFile.path === path,
    );
    return recognitionFile;
  }

  public async create(
    recognitionFile: ICreateRecognitionFileDOT,
  ): Promise<RecognitionFile> {
    const newRecognitionFile = new RecognitionFile();

    Object.assign(newRecognitionFile, { id: Math.random() }, recognitionFile);

    this.recognitionFiles.push(newRecognitionFile);

    return newRecognitionFile;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.recognitionFiles.findIndex(
      currentFile => currentFile.id === id,
    );
    this.recognitionFiles.splice(findIndex, 1);
  }

  public async save({ id, path }: RecognitionFile): Promise<RecognitionFile> {
    const findIndex = this.recognitionFiles.findIndex(
      currentFile => currentFile.id === id,
    );

    const updatedRecognitionFile = new RecognitionFile();
    updatedRecognitionFile.id = id;
    updatedRecognitionFile.path = path;

    this.recognitionFiles[findIndex] = updatedRecognitionFile;

    return updatedRecognitionFile;
  }
}

export default FakeRecognitionFilesRepository;
