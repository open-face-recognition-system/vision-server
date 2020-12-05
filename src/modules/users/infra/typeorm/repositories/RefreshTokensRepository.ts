import IRefreshTokensRepository from '@modules/users/repositories/IRefreshTokensRepository';
import { getRepository, Repository } from 'typeorm';

import RefreshToken from '../entities/RefreshToken';
import User from '../entities/User';

class RefreshTokensRepository implements IRefreshTokensRepository {
  private ormRepository: Repository<RefreshToken>;

  constructor() {
    this.ormRepository = getRepository(RefreshToken);
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
      relations: ['user'],
    });

    return findRefreshToken;
  }

  public async findByUser(user: User): Promise<RefreshToken | undefined> {
    const findRefreshToken = await this.ormRepository.findOne({
      where: { user },
    });

    return findRefreshToken;
  }
}

export default RefreshTokensRepository;
