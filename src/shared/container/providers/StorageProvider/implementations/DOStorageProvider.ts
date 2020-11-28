import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DOStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    const {
      region,
      endpoint,
      accessKeyId,
      secretAccessKey,
    } = uploadConfig.config.do;
    this.client = new aws.S3({
      region,
      endpoint,
      accessKeyId,
      secretAccessKey,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);
    const { bucket } = uploadConfig.config.do;
    await this.client
      .putObject({
        Bucket: bucket,
        Key: file,
        ACL: 'public-read',
        ContentType,
        Body: fileContent,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const { bucket } = uploadConfig.config.do;
    await this.client
      .deleteObject({
        Bucket: bucket,
        Key: file,
      })
      .promise();
  }

  public async deleteTmpFile(file: string): Promise<void> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    await fs.promises.unlink(originalPath);
  }
}

export default DOStorageProvider;
