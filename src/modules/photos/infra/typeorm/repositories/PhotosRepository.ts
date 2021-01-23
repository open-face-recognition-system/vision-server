import ICreatePhotoDOT from '@modules/photos/dtos/ICreatePhotoDOT';
import IPhotosRepository from '@modules/photos/repositories/IPhotosRepository';
import { classToClass } from 'class-transformer';
import { getRepository, Repository } from 'typeorm';
import Photo from '../entities/Photo';
import PhotoType from '../entities/PhotoType';

class PhotosRepository implements IPhotosRepository {
  private ormRepository: Repository<Photo>;

  constructor() {
    this.ormRepository = getRepository(Photo);
  }

  public async findByStudentId(studentId: number): Promise<Photo[]> {
    const photos = await this.ormRepository.find({
      where: { student: studentId },
    });
    return classToClass(photos);
  }

  public async findById(id: number): Promise<Photo | undefined> {
    const photo = await this.ormRepository.findOne(id);
    return photo;
  }

  public async findByPhotoType(
    studentId: number,
    photoType: PhotoType,
  ): Promise<Photo[]> {
    const photos = await this.ormRepository.find({
      where: { photoType, student: studentId },
    });
    return photos;
  }

  public async create({
    path,
    student,
    photoType,
  }: ICreatePhotoDOT): Promise<Photo> {
    const photo = this.ormRepository.create({
      path,
      student,
      photoType,
    });
    await this.ormRepository.save(photo);
    return photo;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(photo: Photo): Promise<Photo> {
    return this.ormRepository.save(photo);
  }
}

export default PhotosRepository;
