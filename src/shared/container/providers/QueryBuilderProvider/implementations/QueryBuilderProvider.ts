import { QueryBuilder } from 'typeorm-express-query-builder';

import IQueryBuilderProvider from '../models/IQueryBuilderProvider';

class QueryBuilderProvider implements IQueryBuilderProvider {
  public buildQuery(query: any): any {
    delete query.take;
    delete query.skip;
    const builder = new QueryBuilder(query);
    const builtQuery = builder.build();
    return builtQuery;
  }
}

export default QueryBuilderProvider;
