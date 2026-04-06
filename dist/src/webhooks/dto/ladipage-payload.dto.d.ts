import { z } from 'zod';
export declare const LadipageSnapshotPayloadSchema: z.ZodObject<{
    sale_acc_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    saleId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sale_external_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    stages: z.ZodOptional<z.ZodUnknown>;
}, z.core.$loose>;
