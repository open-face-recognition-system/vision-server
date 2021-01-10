import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  saveRecognitionFile(file: string): Promise<string> {
    throw new Error(`Method not implemented.${file}`);
  }

  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    this.storage.slice(findIndex, 1);
  }

  public async deleteTmpFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    this.storage.slice(findIndex, 1);
  }
}

export default FakeStorageProvider;
