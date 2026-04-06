import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { JwtUserPayload } from './types/jwt-user.payload';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly auth;
    private readonly config;
    constructor(auth: AuthService, config: ConfigService);
    login(body: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            saleAccId: string | null;
        };
    }>;
    refresh(req: {
        cookies?: Record<string, string>;
    }, res: Response): Promise<{
        ok: boolean;
    }>;
    logout(user: JwtUserPayload, res: Response): Promise<{
        ok: boolean;
    }>;
    me(user: JwtUserPayload): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
    }>;
}
