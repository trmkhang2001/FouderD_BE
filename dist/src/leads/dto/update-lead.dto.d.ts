import { z } from 'zod';
export declare const UpdateLeadSchema: z.ZodObject<{
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tag: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dealAmount: z.ZodPipe<z.ZodTransform<number | null, unknown>, z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, z.core.$strip>;
declare const UpdateLeadDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tag: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dealAmount: z.ZodPipe<z.ZodTransform<number | null, unknown>, z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, z.core.$strip>, false>;
export declare class UpdateLeadDto extends UpdateLeadDto_base {
}
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;
export {};
