export interface PageQuery {
  where: Record<string, unknown>;
  skip: number;
  take: number;
  order: Record<string, 'ASC' | 'DESC'>;
}

export default interface IQueryBuilderProvider {
  buildQuery(query: Record<string, unknown>): PageQuery;
}
