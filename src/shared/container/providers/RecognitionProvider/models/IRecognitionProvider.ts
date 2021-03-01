export default interface IRecognitionProvider {
  training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string>;
  recognize(id: number, photoPath: string): Promise<string>;
  update(id: number, photoPath: string, subjectId: number): Promise<string>;
}
