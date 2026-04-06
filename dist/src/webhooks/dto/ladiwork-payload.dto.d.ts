import { z } from 'zod';
export declare const LadiworkPayloadSchema: z.ZodObject<{
    phone: z.ZodString;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tag: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sale_acc_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
declare const LadiworkPayloadDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    phone: z.ZodString;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tag: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sale_acc_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class LadiworkPayloadDto extends LadiworkPayloadDto_base {
}
export {};
