import { container } from 'tsyringe';
import recognitionConfig from '@config/recognition';

import IRecognitionProvider from './models/IRecognitionProvider';
import OpenCVRecognitionProvider from './implementations/OpenCVRecognitionProvider';

container.registerSingleton<IRecognitionProvider>('RecognitionProvider', OpenCVRecognitionProvider);

container.registerInstance('RecognitionThreshold', recognitionConfig.threshold);
