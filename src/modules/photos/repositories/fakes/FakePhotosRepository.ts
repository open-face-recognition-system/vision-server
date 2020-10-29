import ICreatePhotoDOT from '@modules/photos/dtos/ICreatePhotoDOT';
import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import IPhotosRepository from '../IPhotosRepository';

class FakePhotosRepository implements IPhotosRepository {
  private photos: Photo[] = [];

  public async listByUserId(userId: number): Promise<Photo[]> {
    const findPhoto = this.photos.filter(photo => photo.user.id === userId);
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
