import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUserPayload } from './types/jwt-user.payload';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { clearAuthCookies, setAuthCookies } from './cookie.util';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.auth.login(
      body.email,
      body.password,
    );
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    setAuthCookies(res, accessToken, refreshToken, isProd);
    return { user };
  }

  @Post('refresh')
  async refresh(
    @Req() req: { cookies?: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    const { accessToken, refreshToken: newRefresh } =
      await this.auth.refresh(refreshToken);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    setAuthCookies(res, accessToken, newRefresh, isProd);
    return { ok: true };
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  async logout(
    @CurrentUser() user: JwtUserPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(user.sub);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    clearAuthCookies(res, isProd);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  me(@CurrentUser() user: JwtUserPayload) {
    return this.auth.getProfile(user.sub);
  }
}
