import { QueryBuilder } from 'typeorm-express-query-builder';

import IQueryBuilderProvider from '../models/IQueryBuilderProvider';

class QueryBuilderProvider implements IQueryBuilderProvider {
  public buildQuery(query: any): any {
    const builder = new QueryBuilder(query);
    const builtQuery = builder.build();
    return builtQuery;
  }
}

export default QueryBuilderProvider;
