import { spawnSync } from 'child_process';
import IRecognitionProvider from '../models/IRecognitionProvider';

class EigenfacesProvider implements IRecognitionProvider {
  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    const pythonProcess = spawnSync('python', [
      JSON.stringify(ids),
      JSON.stringify(photosPath),
      String(subjectId),
    ]).stdout;

    return pythonProcess.toString();
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    const pythonProcess = spawnSync('python', [photoPath, String(id)]).stdout;

    return pythonProcess.toString();
  }
}

export default EigenfacesProvider;
