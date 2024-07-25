import { Logger, Scope } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/app/entities';
import { EnvironmentConfiguration } from 'src/app/infrastructures/config';
import { TokenPayloadDto } from '../dtos/token-payload.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentConfiguration>,
  ) {}

  async generateAccessToken(user: User): Promise<string> {
    const accessToken = await this.jwtService.signAsync({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
    return accessToken;
  }

  async validateToken(token: string): Promise<TokenPayloadDto | null> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        {
          secret: this.configService.get('jwtSecret'),
        },
      );
      return payload;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async validatePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashPassword);
    return isMatch;
  }
}
