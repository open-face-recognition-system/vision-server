export default interface IRecognitionProvider {
  training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string>;
  recognize(id: number, photoPath: string): Promise<string>;
}
