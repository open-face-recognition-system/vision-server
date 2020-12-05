import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import { isUuid } from 'uuidv4';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';
import Role from '../infra/typeorm/entities/Role';
import IStudentsRepository from '../repositories/IStudentsRepository';
import ITeachersRepository from '../repositories/ITeachersRepository';
import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';

interface ISignInRequest {
  email: string;
  password: string;
}

interface IAuthenticateResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@injectable()
class AuthenticateUserService {
  private usersRepository: IUsersRepository;

  private studentsRepository: IStudentsRepository;

  private teachersRepository: ITeachersRepository;

  private refreshTokensRepository: IRefreshTokensRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('StudentsRepository')
    studentsRepository: IStudentsRepository,
    @inject('TeachersRepository')
    teachersRepository: ITeachersRepository,
    @inject('RefreshTokensRepository')
    refreshTokensRepository: IRefreshTokensRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.studentsRepository = studentsRepository;
    this.teachersRepository = teachersRepository;
    this.refreshTokensRepository = refreshTokensRepository;
    this.hashProvider = hashProvider;
  }

  private async getStudentId(user: User): Promise<number> {
    const student = await this.studentsRepository.findByUser(user);
    return student?.id || user.id;
  }

  private async getTeacherId(user: User): Promise<number> {
    const teacher = await this.teachersRepository.findByUser(user);
    return teacher?.id || user.id;
  }

  private async getIdByUserRole(user: User): Promise<number> {
    let { id } = user;
    if (user.role === Role.STUDENT) {
      id = await this.getStudentId(user);
    }

    if (user.role === Role.TEACHER) {
      id = await this.getTeacherId(user);
    }
    return id;
  }

  public async signIn({
    email,
    password,
  }: ISignInRequest): Promise<IAuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const id = await this.getIdByUserRole(user);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ id, role: user.role }, secret, {
      expiresIn,
    });

    let refreshUserToken = await this.refreshTokensRepository.findByUser(user);

    if (!refreshUserToken) {
      const newRefreshToken = await this.refreshTokensRepository.generate(user);
      refreshUserToken = newRefreshToken;
    }

    return {
      user,
      token,
      refreshToken: refreshUserToken.refreshToken,
    };
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<IAuthenticateResponse> {
    if (!isUuid(refreshToken)) {
      throw new AppError('Invalid refresh token.', 401);
    }

    const refreshTokenExists = await this.refreshTokensRepository.findByToken(
      refreshToken,
    );

    if (!refreshTokenExists) {
      throw new AppError('Token not found.', 401);
    }

    const { refreshToken: newRefreshToken, user } = refreshTokenExists;

    const id = await this.getIdByUserRole(user);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ id, role: user.role }, secret, {
      expiresIn,
    });

    return {
      user,
      token,
      refreshToken: newRefreshToken,
    };
  }
}

export default AuthenticateUserService;
