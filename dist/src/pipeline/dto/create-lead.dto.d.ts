import { z } from 'zod';
export declare const CreateLeadSchema: z.ZodObject<{
    phone: z.ZodPipe<z.ZodTransform<string, unknown>, z.ZodString>;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tag: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    saleId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    pipelineStage: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        NEW: "NEW";
        CONTACTED: "CONTACTED";
        PERSUADING: "PERSUADING";
        PAYMENT_SUCCESS: "PAYMENT_SUCCESS";
        ZALO_JOINED: "ZALO_JOINED";
        REFUND: "REFUND";
    }>>>;
    dealAmount: z.ZodPipe<z.ZodTransform<number | null, unknown>, z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, z.core.$strip>;
declare const CreateLeadDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    phone: z.ZodPipe<z.ZodTransform<string, unknown>, z.ZodString>;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tag: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    saleId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    pipelineStage: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        NEW: "NEW";
        CONTACTED: "CONTACTED";
        PERSUADING: "PERSUADING";
        PAYMENT_SUCCESS: "PAYMENT_SUCCESS";
        ZALO_JOINED: "ZALO_JOINED";
        REFUND: "REFUND";
    }>>>;
    dealAmount: z.ZodPipe<z.ZodTransform<number | null, unknown>, z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, z.core.$strip>, false>;
export declare class CreateLeadDto extends CreateLeadDto_base {
}
export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export {};
