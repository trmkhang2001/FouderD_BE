import { z } from 'zod';
export declare const SepayPayloadSchema: z.ZodObject<{
    amount: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    content: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    transaction_date: z.ZodCoercedDate<unknown>;
    transaction_id: z.ZodString;
    phone_sender: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    is_verified: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const SepayPayloadDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    amount: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    content: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    transaction_date: z.ZodCoercedDate<unknown>;
    transaction_id: z.ZodString;
    phone_sender: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    is_verified: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, false>;
export declare class SepayPayloadDto extends SepayPayloadDto_base {
}
export {};
