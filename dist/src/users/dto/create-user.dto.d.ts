import { z } from 'zod';
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALE: "SALE";
    }>;
    saleAccId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
declare const CreateUserDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALE: "SALE";
    }>;
    saleAccId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class CreateUserDto extends CreateUserDto_base {
}
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export {};
