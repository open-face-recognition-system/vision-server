import spawn from 'await-spawn';
import IRecognitionProvider from '../models/IRecognitionProvider';

class EigenfacesProvider implements IRecognitionProvider {
  public async training(
    ids: number[],
    photosPath: string[],
    subjectId: number,
  ): Promise<string> {
    const trainingPaht = './src/shared/infra/opencv/training/eigenfaces.py';
    const pythonProcess = await spawn('python', [
      trainingPaht,
      JSON.stringify(ids),
      JSON.stringify(photosPath),
      String(subjectId),
    ]);

    return pythonProcess.toString();
  }

  public async recognize(id: number, photoPath: string): Promise<string> {
    throw new Error(`Method not implemented.${id}${photoPath}`);
  }
}

export default EigenfacesProvider;
