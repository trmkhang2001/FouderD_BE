import type { Response } from 'express';
export declare function setAuthCookies(res: Response, accessToken: string, refreshToken: string, isProd: boolean): void;
export declare function clearAuthCookies(res: Response, isProd: boolean): void;
