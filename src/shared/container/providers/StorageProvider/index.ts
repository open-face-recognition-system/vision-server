import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import DOStorageProvider from './implementations/DOStorageProvider';
import RecognitionFileStorageProvider from './implementations/RecognitionFileStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  do: DOStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);

container.registerSingleton<IStorageProvider>(
  'RecognitionFileStorageProvider',
  RecognitionFileStorageProvider,
);
