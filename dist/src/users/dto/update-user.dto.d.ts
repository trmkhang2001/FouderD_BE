import { z } from 'zod';
export declare const UpdateUserSchema: z.ZodObject<{
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALE: "SALE";
    }>;
    saleAccId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
declare const UpdateUserDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALE: "SALE";
    }>;
    saleAccId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export {};
