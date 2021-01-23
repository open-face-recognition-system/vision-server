import { spawnSync } from 'child_process';
import IRecognitionProvider from '../models/IRecognitionProvider';

class LBPHProvider implements IRecognitionProvider {
  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    const trainingPaht = './src/shared/infra/opencv/training/lbph.py';
    const pythonProcess = spawnSync('python', [
      trainingPaht,
      JSON.stringify(ids),
      JSON.stringify(photosPath),
      String(subjectId),
    ]).stdout;

    return pythonProcess.toString();
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    const recognizePath = './src/shared/infra/opencv/recognize/lbph.py';
    const pythonProcess = spawnSync('python', [
      recognizePath,
      photoPath,
      String(id),
    ]).stdout;

    return pythonProcess.toString();
  }
}

export default LBPHProvider;
