export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  saveRecognitionFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
  deleteTmpFile(file: string): Promise<void>;
}
