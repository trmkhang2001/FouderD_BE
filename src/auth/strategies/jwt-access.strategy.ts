import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { JwtUserPayload } from '../types/jwt-user.payload';

function accessTokenExtractor(req: Request): string | null {
  const token = req?.cookies?.access_token;
  if (typeof token === 'string' && token.length > 0) {
    return token;
  }
  return null;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: accessTokenExtractor,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    role: JwtUserPayload['role'];
  }): JwtUserPayload {
    if (!payload?.sub || !payload?.email || !payload?.role) {
      throw new UnauthorizedException();
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
