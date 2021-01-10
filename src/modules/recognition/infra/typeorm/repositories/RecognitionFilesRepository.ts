import ICreateRecognitionFileDOT from '@modules/recognition/dtos/ICreateRecognitionFileDOT';
import IRecognitionFilesRepository from '@modules/recognition/repositories/IRecognitionFilesRepository';
import { getRepository, Repository } from 'typeorm';
import RecognitionFile from '../entities/RecognitionFile';

class RecognitionFilesRepository implements IRecognitionFilesRepository {
  private ormRepository: Repository<RecognitionFile>;

  constructor() {
    this.ormRepository = getRepository(RecognitionFile);
  }

  public async findByPath(path: string): Promise<RecognitionFile | undefined> {
    const photo = await this.ormRepository.findOne({
      where: {
        path,
      },
    });
    return photo;
  }

  public async create({
    path,
  }: ICreateRecognitionFileDOT): Promise<RecognitionFile> {
    const photo = this.ormRepository.create({
      path,
    });
    await this.ormRepository.save(photo);
    return photo;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(photo: RecognitionFile): Promise<RecognitionFile> {
    return this.ormRepository.save(photo);
  }
}

export default RecognitionFilesRepository;
