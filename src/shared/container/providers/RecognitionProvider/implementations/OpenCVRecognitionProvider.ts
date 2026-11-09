import path from 'path';
import { execFile } from 'child_process';
import recognitionConfig from '@config/recognition';
import uploadConfig from '@config/upload';
import IRecognitionProvider, { Prediction, Samples } from '../models/IRecognitionProvider';

const SCRIPT = path.resolve(process.cwd(), 'opencv', 'recognizer.py');

class OpenCVRecognitionProvider implements IRecognitionProvider {
  public async train(subjectId: number, samples: Samples): Promise<string> {
    const modelFile = this.modelFile(subjectId);
    await this.run(['train', this.modelPath(modelFile)], samples);
    return modelFile;
  }

  public async update(subjectId: number, samples: Samples): Promise<void> {
    await this.run(['update', this.modelPath(this.modelFile(subjectId))], samples);
  }

  public async predict(subjectId: number, imagePath: string): Promise<Prediction> {
    const output = await this.run(['predict', this.modelPath(this.modelFile(subjectId)), imagePath]);
    const [studentId, distance] = output.trim().split(',').map(Number);
    return { studentId, distance };
  }

  private modelFile(subjectId: number): string {
    return `subject-${subjectId}-${recognitionConfig.algorithm}.yml`;
  }

  private modelPath(modelFile: string): string {
    return path.join(uploadConfig.recognitionFilesFolder, modelFile);
  }

  private run(args: string[], samples?: Samples): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = execFile(
        recognitionConfig.python,
        [SCRIPT, recognitionConfig.algorithm, ...args],
        (error, stdout, stderr) =>
          error
            ? reject(new Error(`recognizer ${args[0]} failed: ${stderr || error.message}`))
            : resolve(stdout),
      );
      child.stdin?.end(samples ? JSON.stringify(samples) : undefined);
    });
  }
}

export default OpenCVRecognitionProvider;
