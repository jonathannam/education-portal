import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivationUserLog, RefreshToken, User } from 'src/app/entities';
import { AuthService } from 'src/app/infrastructures/auth';
import { PagingDto } from 'src/app/infrastructures/dtos';
import { generateRandomString } from 'src/app/infrastructures/utils';
import { ILike, Repository } from 'typeorm';
import {
  AuthResponseDto,
  CreateUserRequestDto,
  GetListUserQueryParamsDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  ResetPasswordResponseDto,
  UpdateActiveStatusUserResponseDto,
  UpdateUserRequestDto,
  UserDto,
} from './dtos';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ActivationUserLog)
    private activationUserLogRepository: Repository<ActivationUserLog>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createUser(request: CreateUserRequestDto): Promise<void> {
    const userValidate = await this.userRepository.findOne({
      where: [{ username: request.username }],
    });
    if (userValidate) {
      throw new BadRequestException('Username must be unique');
    }
    await this.userRepository.save({
      ...request,
      password: await this.authService.hashPassword(request.password),
    });
  }

  async login(request: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          username: request.username,
        },
      ],
    });
    if (!user) {
      throw new UnauthorizedException('Username does not exist');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('The user account is currently inactive');
    }
    const isValidPassword = await this.authService.validatePassword(
      request.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    return {
      role: user.role,
      username: user.username,
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async refreshToken(
    request: RefreshTokenRequestDto,
  ): Promise<AuthResponseDto> {
    const oldRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: request.token,
      },
      relations: {
        user: true,
      },
    });

    if (!oldRefreshToken) {
      throw new NotFoundException('Invalid refresh token');
    }

    if (oldRefreshToken.expiresAt <= new Date()) {
      await this.refreshTokenRepository.remove(oldRefreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    const accessToken = await this.authService.generateAccessToken(
      oldRefreshToken.user,
    );

    const newRefreshToken = await this.createRefreshToken(oldRefreshToken.user);
    await this.refreshTokenRepository.remove(oldRefreshToken);
    const loginResponse: AuthResponseDto = {
      username: oldRefreshToken.user.username,
      role: oldRefreshToken.user.role,
      accessToken: accessToken,
      refreshToken: newRefreshToken.token,
    };

    return loginResponse;
  }

  async updateUser(
    userId: number,
    request: UpdateUserRequestDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    user.username = request.username || user.username;
    user.role = request.role;
    await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete({
      id: userId,
    });
  }

  async getListUser(
    query?: GetListUserQueryParamsDto,
  ): Promise<PagingDto<UserDto>> {
    const [users, totalCount] = await this.userRepository.findAndCount({
      where: {
        ...(query?.username && { username: ILike(`%${query.username}%`) }),
        ...(query?.role && { role: query.role }),
        ...(query?.isActive !== null &&
          query?.isActive !== undefined && { isActive: query.isActive }),
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (query.pageIndex - 1) * query.pageSize,
      take: query.pageSize,
    });
    return {
      items: users.map((user) => ({
        createdAt: user.createdAt,
        id: user.id,
        role: user.role,
        updatedAt: user.updatedAt,
        username: user.username,
        isActive: user.isActive,
      })),
      totalCount,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    };
  }

  async resetPassword(userId: number): Promise<ResetPasswordResponseDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const newPassword = generateRandomString(6);
    user.password = await this.authService.hashPassword(newPassword);
    await this.userRepository.save(user);
    return {
      newPassword,
    };
  }

  async updateActiveStatusUser(
    userId: number,
    request,
  ): Promise<UpdateActiveStatusUserResponseDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    const activeLog = this.activationUserLogRepository.create({
      isActive: user.isActive,
      author: {
        id: request['user'].id,
      },
    });
    await this.activationUserLogRepository.save(activeLog);
    return {
      isActive: user.isActive,
    };
  }

  private async createRefreshToken(user: User): Promise<RefreshToken> {
    const EXPIRES_IN = 60 * 5;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRES_IN);

    const refreshToken = this.refreshTokenRepository.create({
      expiresAt,
      user,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }
}
