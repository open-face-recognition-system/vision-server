import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class RecognitionFileStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    console.log(file);

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.recognitionFilesFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.recognitionFilesFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }

  public async deleteTmpFile(file: string): Promise<void> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    await fs.promises.unlink(originalPath);
  }
}

export default RecognitionFileStorageProvider;
