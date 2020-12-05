import User from '../infra/typeorm/entities/User';
import RefreshToken from '../infra/typeorm/entities/RefreshToken';

export default interface IRefreshTokensRepository {
  generate(user: User): Promise<RefreshToken>;
  findByToken(refreshToken: string): Promise<RefreshToken | undefined>;
  findByUser(user: User): Promise<RefreshToken | undefined>;
}
