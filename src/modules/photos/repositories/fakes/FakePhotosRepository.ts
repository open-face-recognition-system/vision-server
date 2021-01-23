import ICreatePhotoDOT from '@modules/photos/dtos/ICreatePhotoDOT';
import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import PhotoType from '@modules/photos/infra/typeorm/entities/PhotoType';
import IPhotosRepository from '../IPhotosRepository';

class FakePhotosRepository implements IPhotosRepository {
  private photos: Photo[] = [];

  public async findByStudentId(studentId: number): Promise<Photo[]> {
    const findPhoto = this.photos.filter(
      photo => photo.student.id === studentId,
    );
    return findPhoto;
  }

  public async findById(id: number): Promise<Photo | undefined> {
    const findPhoto = this.photos.find(photo => photo.id === id);
    return findPhoto;
  }

  public async create(photo: ICreatePhotoDOT): Promise<Photo> {
    const newPhoto = new Photo();

    Object.assign(newPhoto, { id: Math.random() }, photo);

    this.photos.push(newPhoto);

    return newPhoto;
  }

  public async findByPhotoType(
    userId: number,
    photoType: PhotoType,
  ): Promise<Photo[]> {
    const findPhoto = this.photos.filter(
      photo => photo.photoType === photoType,
    );
    return findPhoto;
  }

  public async delete(id: number): Promise<void> {
    const findIndex = this.photos.findIndex(findPhoto => findPhoto.id === id);
    this.photos.splice(findIndex, 1);
  }

  public async save(photo: Photo): Promise<Photo> {
    const findIndex = this.photos.findIndex(
      findPhoto => findPhoto.id === photo.id,
    );
    this.photos[findIndex] = photo;
    return photo;
  }
}

export default FakePhotosRepository;
