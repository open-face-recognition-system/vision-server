import { spawnSync } from 'child_process';
import IRecognitionProvider from '../models/IRecognitionProvider';

class LBPHProvider implements IRecognitionProvider {
  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    const trainingPath = `opencv/training/lbph.py`;
    const pythonProcess = spawnSync('python', [
      trainingPath,
      JSON.stringify(ids),
      JSON.stringify(photosPath),
      String(subjectId),
    ]).stdout;

    return pythonProcess.toString();
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    const recognizePath = `opencv/recognize/lbph.py`;
    const pythonProcess = spawnSync('python', [
      recognizePath,
      photoPath,
      String(id),
    ]).stdout;

    return pythonProcess.toString();
  }
}

export default LBPHProvider;