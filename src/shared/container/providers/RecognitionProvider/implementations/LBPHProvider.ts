import { spawnSync } from 'child_process';
import IRecognitionProvider from '../models/IRecognitionProvider';

class LBPHProvider implements IRecognitionProvider {
  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    const trainingPath = `opencv/training/lbph.py`;
    const pythonEnv = process.env.PYTHON_DRIVER;
    const pythonProcess = spawnSync(String(pythonEnv), [
      trainingPath,
      JSON.stringify(ids),
      JSON.stringify(photosPath),
      String(subjectId),
    ]).stdout;

    return pythonProcess.toString();
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    const recognizePath = `opencv/recognize/lbph.py`;
    const pythonEnv = process.env.PYTHON_DRIVER;
    const pythonProcess = spawnSync(String(pythonEnv), [
      recognizePath,
      photoPath,
      String(id),
    ]).stdout;

    return pythonProcess.toString();
  }

  public async update(
    id: number,
    photoPath: string,
    subjectId: number,
  ): Promise<string> {
    const updatePath = `opencv/update/lbph.py`;
    const pythonEnv = process.env.PYTHON_DRIVER;

    const pythonProcess = spawnSync(String(pythonEnv), [
      updatePath,
      JSON.stringify([id]),
      JSON.stringify([photoPath]),
      String(subjectId),
    ]).stdout;

    return pythonProcess.toString();
  }
}

export default LBPHProvider;
