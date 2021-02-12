import fs from 'fs';
import request from 'request';
import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import PhotoType from '@modules/photos/infra/typeorm/entities/PhotoType';

class PhotoHandler {
  private normalPhotos: Photo[];

  private smilingPhotos: Photo[];

  private closedEyesPhotos: Photo[];

  private leftSidePhotos: Photo[];

  private rightSidePhotos: Photo[];

  constructor(photos: Photo[]) {
    this.normalPhotos = [];
    this.smilingPhotos = [];
    this.closedEyesPhotos = [];
    this.leftSidePhotos = [];
    this.rightSidePhotos = [];
    this.separatePhotos(photos);
  }

  private separatePhotos(photos: Photo[]) {
    photos.forEach(photo => {
      if (photo.photoType === PhotoType.NORMAL) {
        this.normalPhotos.push(photo);
      }
      if (photo.photoType === PhotoType.SMILING) {
        this.smilingPhotos.push(photo);
      }
      if (photo.photoType === PhotoType.CLOSED_EYES) {
        this.closedEyesPhotos.push(photo);
      }
      if (photo.photoType === PhotoType.LEFT_SIDE) {
        this.leftSidePhotos.push(photo);
      }
      if (photo.photoType === PhotoType.RIGHT_SIDE) {
        this.rightSidePhotos.push(photo);
      }
    });
  }

  public async addedTestSet(): Promise<void> {
    const normalPhoto = this.normalPhotos[5];
    const smilingPhotos = this.smilingPhotos[5];
    const closedEyesPhoto = this.closedEyesPhotos[5];
    const leftSidePhoto = this.leftSidePhotos[5];
    const rightSidePhoto = this.rightSidePhotos[5];
    await this.download(
      `${process.env.DO_URL}/photos/${normalPhoto.path}`,
      `tests/${normalPhoto.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${smilingPhotos.path}`,
      `tests/${smilingPhotos.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${closedEyesPhoto.path}`,
      `tests/${closedEyesPhoto.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${leftSidePhoto.path}`,
      `tests/${leftSidePhoto.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${rightSidePhoto.path}`,
      `tests/${rightSidePhoto.path}`,
    );
  }

  public async addedFiveSet(): Promise<void> {
    const normalPhoto = this.normalPhotos[0];
    const smilingPhotos = this.smilingPhotos[0];
    const closedEyesPhoto = this.closedEyesPhotos[0];
    const leftSidePhoto = this.leftSidePhotos[0];
    const rightSidePhoto = this.rightSidePhotos[0];
    await this.download(
      `${process.env.DO_URL}/photos/${normalPhoto.path}`,
      `5/${normalPhoto.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${smilingPhotos.path}`,
      `5/${smilingPhotos.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${closedEyesPhoto.path}`,
      `5/${closedEyesPhoto.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${leftSidePhoto.path}`,
      `5/${leftSidePhoto.path}`,
    );
    await this.download(
      `${process.env.DO_URL}/photos/${rightSidePhoto.path}`,
      `5/${rightSidePhoto.path}`,
    );
  }

  public async addedTenSet(): Promise<void> {
    const normalPhotos = this.normalPhotos.slice(0, 2);
    const smilingPhotos = this.smilingPhotos.slice(0, 2);
    const closedEyesPhotos = this.closedEyesPhotos.slice(0, 2);
    const leftSidePhotos = this.leftSidePhotos.slice(0, 2);
    const rightSidePhotos = this.rightSidePhotos.slice(0, 2);
    normalPhotos.forEach(async normalPhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${normalPhoto.path}`,
        `10/${normalPhoto.path}`,
      );
    });

    smilingPhotos.forEach(async smilingPhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${smilingPhoto.path}`,
        `10/${smilingPhoto.path}`,
      );
    });

    closedEyesPhotos.forEach(async closedEyesPhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${closedEyesPhoto.path}`,
        `10/${closedEyesPhoto.path}`,
      );
    });

    leftSidePhotos.forEach(async leftSidePhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${leftSidePhoto.path}`,
        `10/${leftSidePhoto.path}`,
      );
    });

    rightSidePhotos.forEach(async rightSidePhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${rightSidePhoto.path}`,
        `10/${rightSidePhoto.path}`,
      );
    });
  }

  public async addedTwentyFiveSet(): Promise<void> {
    const normalPhotos = this.normalPhotos.slice(0, 6);
    const smilingPhotos = this.smilingPhotos.slice(0, 6);
    const closedEyesPhotos = this.closedEyesPhotos.slice(0, 6);
    const leftSidePhotos = this.leftSidePhotos.slice(0, 6);
    const rightSidePhotos = this.rightSidePhotos.slice(0, 6);
    normalPhotos.forEach(async normalPhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${normalPhoto.path}`,
        `25/${normalPhoto.path}`,
      );
    });

    smilingPhotos.forEach(async smilingPhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${smilingPhoto.path}`,
        `25/${smilingPhoto.path}`,
      );
    });

    closedEyesPhotos.forEach(async closedEyesPhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${closedEyesPhoto.path}`,
        `25/${closedEyesPhoto.path}`,
      );
    });

    leftSidePhotos.forEach(async leftSidePhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${leftSidePhoto.path}`,
        `25/${leftSidePhoto.path}`,
      );
    });

    rightSidePhotos.forEach(async rightSidePhoto => {
      await this.download(
        `${process.env.DO_URL}/photos/${rightSidePhoto.path}`,
        `25/${rightSidePhoto.path}`,
      );
    });
  }

  private async download(uri: string, filename: string): Promise<void> {
    const file = fs.createWriteStream(
      `./src/modules/validation/temp/${filename}`,
    );

    await new Promise((resolve, reject) => {
      request({
        uri,
        gzip: true,
      })
        .pipe(file)
        .on('finish', async () => {
          resolve('ok');
        })
        .on('error', error => {
          reject(error);
        });
    }).catch(error => {
      console.log(`Something happened: ${error}`);
    });
  }
}

export default PhotoHandler;
