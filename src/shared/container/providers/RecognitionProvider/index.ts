import { container } from 'tsyringe';

import recognitionConfig from '@config/recognition';
import IRecognitionProvider from './models/IRecognitionProvider';
import EigenfacesProvider from './implementations/EigenfacesProvider';

const providers = {
  eigenfaces: EigenfacesProvider,
  fisherfaces: EigenfacesProvider,
  lbph: EigenfacesProvider,
};

container.registerSingleton<IRecognitionProvider>(
  'RecognitionProvider',
  providers[recognitionConfig.driver],
);
