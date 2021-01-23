import IRecognitionProvider from '../models/IRecognitionProvider';

interface FakeTrainingData {
  id: number;
  photoPath: string;
  subjectId: number;
}

class FakeRecognitionProvider implements IRecognitionProvider {
  private traningData: FakeTrainingData[] = [];

  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    ids.forEach(id => {
      this.traningData.push({
        id,
        photoPath: photosPath[0],
        subjectId,
      });
    });
    return 'fakePath';
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    const findData = this.traningData.find(
      data => data.id === id && data.photoPath === photoPath,
    );
    if (findData) {
      return String(findData.id);
    }
    return '0';
  }
}

export default FakeRecognitionProvider;
