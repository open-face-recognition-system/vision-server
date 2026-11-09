import QueryBuilderProvider from './QueryBuilderProvider';

describe('QueryBuilderProvider', () => {
  const provider = new QueryBuilderProvider();

  it('should translate page and limit into skip and take', () => {
    expect(provider.buildQuery({ page: '3', limit: '10' })).toEqual({
      where: {},
      skip: 20,
      take: 10,
      order: {},
    });
  });

  it('should default to the first page of 25 items', () => {
    expect(provider.buildQuery({})).toMatchObject({ skip: 0, take: 25 });
  });

  it('should cap the page size at 100', () => {
    expect(provider.buildQuery({ limit: '5000' })).toMatchObject({ take: 100 });
  });

  it('should translate a signed order field into a TypeORM order', () => {
    expect(provider.buildQuery({ order: '-startHour' }).order).toEqual({
      startHour: 'DESC',
    });
    expect(provider.buildQuery({ order: '+startHour' }).order).toEqual({
      startHour: 'ASC',
    });
  });

  it('should ignore order fields that are not plain identifiers', () => {
    expect(provider.buildQuery({ order: '+user.password' }).order).toEqual({});
  });
});
