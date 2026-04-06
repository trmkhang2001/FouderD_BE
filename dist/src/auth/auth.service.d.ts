import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwt;
    private readonly config;
    constructor(authRepository: AuthRepository, jwt: JwtService, config: ConfigService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        tokenVersion: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            saleAccId: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string | undefined): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private issueTokenPair;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
    }>;
}
