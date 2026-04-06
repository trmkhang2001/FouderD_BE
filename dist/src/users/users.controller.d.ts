import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(body: CreateUserDto): Promise<{
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
    update(id: string, body: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        saleAccId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
