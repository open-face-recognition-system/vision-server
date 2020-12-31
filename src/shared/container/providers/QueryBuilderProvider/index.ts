import { container } from 'tsyringe';

import IQueryBuilderProvider from './models/IQueryBuilderProvider';
import QueryBuilderProvider from './implementations/QueryBuilderProvider';

container.registerSingleton<IQueryBuilderProvider>(
  'QueryBuilderProvider',
  QueryBuilderProvider,
);
