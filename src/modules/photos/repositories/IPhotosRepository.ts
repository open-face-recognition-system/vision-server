import ICreatePhotoDOT from '../dtos/ICreatePhotoDOT';
import Photo from '../infra/typeorm/entities/Photo';
import PhotoType from '../infra/typeorm/entities/PhotoType';

export default interface IPhotosRepository {
  findByStudentId(studentId: number): Promise<Photo[]>;
  findById(id: number): Promise<Photo | undefined>;
  findByPhotoType(studentId: number, photoType: PhotoType): Promise<Photo[]>;
  create(photo: ICreatePhotoDOT): Promise<Photo>;
  delete(id: number): Promise<void>;
  save(photo: Photo): Promise<Photo>;
}
