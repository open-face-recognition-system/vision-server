import { container } from 'tsyringe';

import IDownloadProvider from './models/IDownloadProvider';
import DownloadProvider from './implementations/DownloadProvider';

container.registerSingleton<IDownloadProvider>(
  'DownloadProvider',
  DownloadProvider,
);
