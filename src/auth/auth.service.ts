import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { JwtUserPayload } from './types/jwt-user.payload';

type AccessPayload = JwtUserPayload & { tv: number };
type RefreshPayload = { sub: string; tv: number; typ: 'refresh' };

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokenPair(
      user.id,
      user.email,
      user.role,
      user.tokenVersion,
    );
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        saleAccId: user.saleAccId,
      },
    };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    let payload: RefreshPayload;
    try {
      payload = await this.jwt.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.typ !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || user.tokenVersion !== payload.tv) {
      throw new UnauthorizedException('Session expired');
    }
    return this.issueTokenPair(
      user.id,
      user.email,
      user.role,
      user.tokenVersion,
    );
  }

  private async issueTokenPair(
    userId: string,
    email: string,
    role: Role,
    tokenVersion: number,
  ) {
    const accessPayload: AccessPayload = {
      sub: userId,
      email,
      role,
      tv: tokenVersion,
    };
    const refreshPayload: RefreshPayload = {
      sub: userId,
      tv: tokenVersion,
      typ: 'refresh',
    };
    const accessToken = await this.jwt.signAsync(
      {
        sub: accessPayload.sub,
        email: accessPayload.email,
        role: accessPayload.role,
        tv: accessPayload.tv,
      },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: 15 * 60,
      },
    );
    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: 7 * 24 * 60 * 60,
    });
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.authRepository.invalidateRefreshTokens(userId);
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      saleAccId: user.saleAccId,
    };
  }
}
