import { container } from 'tsyringe';

import recognitionConfig from '@config/recognition';
import IRecognitionProvider from './models/IRecognitionProvider';
import EigenfacesProvider from './implementations/EigenfacesProvider';
import FisherfacesProvider from './implementations/FisherfacesProvider';
import LBPHProvider from './implementations/LBPHProvider';

const providers = {
  eigenfaces: EigenfacesProvider,
  fisherfaces: FisherfacesProvider,
  lbph: LBPHProvider,
};

container.registerSingleton<IRecognitionProvider>(
  'RecognitionProvider',
  providers[recognitionConfig.driver],
);
