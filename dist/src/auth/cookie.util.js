"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
const ACCESS = 'access_token';
const REFRESH = 'refresh_token';
function setAuthCookies(res, accessToken, refreshToken, isProd) {
    const base = {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
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
function clearAuthCookies(res, isProd) {
    const base = {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
    };
    res.clearCookie(ACCESS, base);
    res.clearCookie(REFRESH, base);
}
//# sourceMappingURL=cookie.util.js.map