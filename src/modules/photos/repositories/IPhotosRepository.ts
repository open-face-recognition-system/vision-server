import ICreatePhotoDOT from '../dtos/ICreatePhotoDOT';
import Photo from '../infra/typeorm/entities/Photo';

export default interface IPhotosRepository {
  listByUserId(userId: number): Promise<Photo[]>;
  findById(id: number): Promise<Photo | undefined>;
  create(photo: ICreatePhotoDOT): Promise<Photo>;
  delete(id: number): Promise<void>;
  save(photo: Photo): Promise<Photo>;
}
