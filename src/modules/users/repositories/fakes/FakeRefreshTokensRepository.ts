import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import RefreshToken from '@modules/users/infra/typeorm/entities/RefreshToken';
import IRefreshTokensRepository from '../IRefreshTokensRepository';

class FakeRefreshTokensRepository implements IRefreshTokensRepository {
  private refreshTokens: RefreshToken[] = [];

  public async generate(user: User): Promise<RefreshToken> {
    const userToken = new RefreshToken();
    Object.assign(userToken, {
      id: Math.random(),
      refreshToken: uuid(),
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.refreshTokens.push(userToken);

    return userToken;
  }

  public async findByToken(
    refreshToken: string,
  ): Promise<RefreshToken | undefined> {
    const findRefreshToken = this.refreshTokens.find(
      findToken => findToken.refreshToken === refreshToken,
    );
    return findRefreshToken;
  }

  public async findByUser(user: User): Promise<RefreshToken | undefined> {
    const findRefreshToken = this.refreshTokens.find(
      findToken => findToken.user === user,
    );
    return findRefreshToken;
  }
}

export default FakeRefreshTokensRepository;
