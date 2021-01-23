import IQueryBuilderProvider from '../models/IQueryBuilderProvider';

class FakeQueryBuilderProvider implements IQueryBuilderProvider {
  public buildQuery(query: any): any {
    return query;
  }
}

export default FakeQueryBuilderProvider;
