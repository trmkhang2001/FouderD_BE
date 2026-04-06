import { Role } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { CreateUserInput } from './dto/create-user.dto';
export declare class UsersService {
    private readonly users;
    constructor(users: UsersRepository);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(input: CreateUserInput): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        createdAt: Date;
    }>;
    getOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        createdAt: Date;
    }>;
    update(id: string, input: {
        role: Role;
        saleAccId?: string | null;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
