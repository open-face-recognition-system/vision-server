import IRefreshTokensRepository from '@modules/users/repositories/IRefreshTokensRepository';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/dataSource';

import RefreshToken from '../entities/RefreshToken';
import User from '../entities/User';

class RefreshTokensRepository implements IRefreshTokensRepository {
  private ormRepository: Repository<RefreshToken>;

  constructor() {
    this.ormRepository = dataSource.getRepository(RefreshToken);
  }

  public async generate(user: User): Promise<RefreshToken> {
    const refreshToken = this.ormRepository.create({
      user,
    });

    await this.ormRepository.save(refreshToken);

    return refreshToken;
  }

  public async findByToken(
    refreshToken: string,
  ): Promise<RefreshToken | undefined> {
    const findRefreshToken = await this.ormRepository.findOne({
      where: { refreshToken },
      relations: { user: true },
    });

    return findRefreshToken ?? undefined;
  }

  public async findByUser(user: User): Promise<RefreshToken | undefined> {
    const findRefreshToken = await this.ormRepository.findOne({
      where: { user: { id: user.id } },
    });

    return findRefreshToken ?? undefined;
  }
}

export default RefreshTokensRepository;
