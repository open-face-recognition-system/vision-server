import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import studentPhotosConfig from '@config/studentPhotos';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import Photo from '../infra/typeorm/entities/Photo';
import IPhotosRepository from '../repositories/IPhotosRepository';
import PhotoType from '../infra/typeorm/entities/PhotoType';

@injectable()
class StudentPhotosService {
  private studentsRepository: IStudentsRepository;

  private photosRepository: IPhotosRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('PhotosRepository')
    photosRepository: IPhotosRepository,
    @inject('StorageProvider')
    storageProvider: IStorageProvider,
  ) {
    this.studentsRepository = studentsRepository;
    this.photosRepository = photosRepository;
    this.storageProvider = storageProvider;
  }

  private unknownPhotoType(photoType: string): PhotoType {
    throw new AppError(`Unhandled PhotoType value found ${photoType}`);
  }

  private parsePhotoTypeStringToEnum(photoType: string): PhotoType {
    switch (photoType) {
      case 'normal':
        return PhotoType.NORMAL;
      case 'smilling':
        return PhotoType.SMILING;
      case 'closedEyes':
        return PhotoType.CLOSED_EYES;
      case 'rightSide':
        return PhotoType.RIGHT_SIDE;
      case 'leftSide':
        return PhotoType.LEFT_SIDE;
      default:
        return this.unknownPhotoType(photoType);
    }
  }

  public async showPhotos(studentId: number): Promise<Photo[]> {
    const { quantityOfEachPhoto } = studentPhotosConfig;

    const photoTypes = [
      PhotoType.NORMAL,
      PhotoType.SMILING,
      PhotoType.CLOSED_EYES,
      PhotoType.RIGHT_SIDE,
      PhotoType.LEFT_SIDE,
    ];

    const fooStudentPhotos: Photo[] = [];

    for (let i = 0; i < photoTypes.length; i += 1) {
      for (let j = 0; j < quantityOfEachPhoto; j += 1) {
        const fooPhoto = new Photo();
        fooPhoto.path = '';
        fooPhoto.photoType = photoTypes[i];
        fooStudentPhotos.push(fooPhoto);
      }
    }

    const photos = await this.photosRepository.findByStudentId(studentId);
    photos.forEach(photo => {
      const index = fooStudentPhotos.findIndex(fooStudentPhoto => {
        return (
          photo.photoType === fooStudentPhoto.photoType &&
          fooStudentPhoto.path === ''
        );
      });
      fooStudentPhotos[index] = photo;
    });

    return fooStudentPhotos;
  }

  public async addPhoto(
    studentId: number,
    photoType: string,
    filename: string,
  ): Promise<Photo> {
    const { photoLimit, quantityOfEachPhoto } = studentPhotosConfig;
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      await this.storageProvider.deleteTmpFile(filename);
      throw new AppError('Student does not exists');
    }

    const studentPhotos = await this.photosRepository.findByStudentId(
      studentId,
    );

    if (studentPhotos.length === photoLimit) {
      await this.storageProvider.deleteTmpFile(filename);
      throw new AppError('Student has already reached the photos limit');
    }

    const parsedPhotoType = this.parsePhotoTypeStringToEnum(photoType);

    const photosType = await this.photosRepository.findByPhotoType(
      studentId,
      parsedPhotoType,
    );

    if (photosType.length >= quantityOfEachPhoto) {
      await this.storageProvider.deleteTmpFile(filename);
      throw new AppError('Photo limit of this type reached');
    }

    const path = await this.storageProvider.saveFile(filename);

    const photo = await this.photosRepository.create({
      path,
      photoType: parsedPhotoType,
      student,
    });

    return photo;
  }

  public async updatePhoto(photoId: number, filename: string): Promise<Photo> {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new AppError('Photo does not exists');
    }

    await this.storageProvider.deleteFile(photo.path);
    const path = await this.storageProvider.saveFile(filename);

    photo.path = path;

    await this.photosRepository.save(photo);

    return photo;
  }

  public async deletePhoto(photoId: number): Promise<void> {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new AppError('Photo does not exists');
    }

    await this.storageProvider.deleteFile(photo.path);
    await this.photosRepository.delete(photoId);
  }
}

export default StudentPhotosService;
