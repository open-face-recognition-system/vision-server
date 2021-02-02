import { spawnSync } from 'child_process';
import IRecognitionProvider from '../models/IRecognitionProvider';

class EigenfacesProvider implements IRecognitionProvider {
  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    const mainFolder = process.env.RECOGNITION_CONTEXT;
    const trainingPaht = `./${mainFolder}/shared/infra/opencv/training/eigenfaces.py`;
    const pythonProcess = spawnSync('python', [
      trainingPaht,
      JSON.stringify(ids),
      JSON.stringify(photosPath),
      String(subjectId),
    ]).stdout;

    return pythonProcess.toString();
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    const mainFolder = process.env.RECOGNITION_CONTEXT;
    const recognizePath = `./${mainFolder}/shared/infra/opencv/recognize/eigenfaces.py`;
    const pythonProcess = spawnSync('python', [
      recognizePath,
      photoPath,
      String(id),
    ]).stdout;

    return pythonProcess.toString();
  }
}

export default EigenfacesProvider;
