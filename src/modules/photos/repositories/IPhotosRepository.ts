import ICreatePhotoDOT from '../dtos/ICreatePhotoDOT';
import Photo from '../infra/typeorm/entities/Photo';
import PhotoType from '../infra/typeorm/entities/PhotoType';

export default interface IPhotosRepository {
  listByUserId(userId: number): Promise<Photo[]>;
  findById(id: number): Promise<Photo | undefined>;
  listByPhotoType(userId: number, photoType: PhotoType): Promise<Photo[]>;
  create(photo: ICreatePhotoDOT): Promise<Photo>;
  delete(id: number): Promise<void>;
  save(photo: Photo): Promise<Photo>;
}
