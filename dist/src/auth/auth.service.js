"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const auth_repository_1 = require("./auth.repository");
let AuthService = class AuthService {
    authRepository;
    jwt;
    config;
    constructor(authRepository, jwt, config) {
        this.authRepository = authRepository;
        this.jwt = jwt;
        this.config = config;
    }
    async validateUser(email, password) {
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
    async login(email, password) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.issueTokenPair(user.id, user.email, user.role, user.tokenVersion);
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
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Missing refresh token');
        }
        let payload;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (payload.typ !== 'refresh' || !payload.sub) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.authRepository.findUserById(payload.sub);
        if (!user || user.tokenVersion !== payload.tv) {
            throw new common_1.UnauthorizedException('Session expired');
        }
        return this.issueTokenPair(user.id, user.email, user.role, user.tokenVersion);
    }
    async issueTokenPair(userId, email, role, tokenVersion) {
        const accessPayload = {
            sub: userId,
            email,
            role,
            tv: tokenVersion,
        };
        const refreshPayload = {
            sub: userId,
            tv: tokenVersion,
            typ: 'refresh',
        };
        const accessToken = await this.jwt.signAsync({
            sub: accessPayload.sub,
            email: accessPayload.email,
            role: accessPayload.role,
            tv: accessPayload.tv,
        }, {
            secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
            expiresIn: 15 * 60,
        });
        const refreshToken = await this.jwt.signAsync(refreshPayload, {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: 7 * 24 * 60 * 60,
        });
        return { accessToken, refreshToken };
    }
    async logout(userId) {
        await this.authRepository.invalidateRefreshTokens(userId);
    }
    async getProfile(userId) {
        const user = await this.authRepository.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            saleAccId: user.saleAccId,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map