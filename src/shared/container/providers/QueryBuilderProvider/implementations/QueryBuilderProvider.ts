import IQueryBuilderProvider, { PageQuery } from '../models/IQueryBuilderProvider';

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const ORDER_PATTERN = /^\s*([+-]?)([A-Za-z]\w*)$/;

class QueryBuilderProvider implements IQueryBuilderProvider {
  public buildQuery(query: Record<string, unknown>): PageQuery {
    const page = Math.max(Number(query.page) || 1, 1);
    const take = Math.min(Number(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

    return { where: {}, skip: (page - 1) * take, take, order: this.order(query.order) };
  }

  private order(order: unknown): PageQuery['order'] {
    const match = typeof order === 'string' && ORDER_PATTERN.exec(order);
    if (!match) return {};

    const [, sign, field] = match;
    return { [field]: sign === '-' ? 'DESC' : 'ASC' };
  }
}

export default QueryBuilderProvider;
