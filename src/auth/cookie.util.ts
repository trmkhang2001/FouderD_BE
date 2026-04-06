import type { Response } from 'express';

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  isProd: boolean,
): void {
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
  };
  res.cookie(ACCESS, accessToken, {
    ...base,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH, refreshToken, {
    ...base,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response, isProd: boolean): void {
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
  };
  res.clearCookie(ACCESS, base);
  res.clearCookie(REFRESH, base);
}
