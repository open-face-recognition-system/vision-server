export interface Samples {
  ids: number[];
  paths: string[];
}

export interface Prediction {
  studentId: number;
  distance: number;
}

export default interface IRecognitionProvider {
  train(subjectId: number, samples: Samples): Promise<string>;
  update(subjectId: number, samples: Samples): Promise<void>;
  predict(subjectId: number, imagePath: string): Promise<Prediction>;
}
