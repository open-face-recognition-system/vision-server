import IRecognitionProvider, { Prediction, Samples } from '../models/IRecognitionProvider';

class FakeRecognitionProvider implements IRecognitionProvider {
  public trainedWith?: Samples & { subjectId: number };

  public updatedWith?: Samples & { subjectId: number };

  public predictedWith?: { subjectId: number; imagePath: string };

  public nextPrediction: Prediction = { studentId: 0, distance: 0 };

  public async train(subjectId: number, samples: Samples): Promise<string> {
    this.trainedWith = { subjectId, ...samples };
    return `subject-${subjectId}.yml`;
  }

  public async update(subjectId: number, samples: Samples): Promise<void> {
    this.updatedWith = { subjectId, ...samples };
  }

  public async predict(subjectId: number, imagePath: string): Promise<Prediction> {
    this.predictedWith = { subjectId, imagePath };
    return this.nextPrediction;
  }
}

export default FakeRecognitionProvider;
