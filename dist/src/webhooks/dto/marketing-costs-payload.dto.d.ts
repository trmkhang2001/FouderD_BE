import { z } from 'zod';
export declare const MarketingCostsPayloadSchema: z.ZodObject<{
    sale_acc_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    saleId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sale_external_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    batchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    batch_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    zns_cost: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
    call_cost: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
    email_cost: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
    zns: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
    call: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
    email: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
    red_cost: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>>, z.ZodTransform<string | number | null | undefined, string | number | null | undefined>>;
}, z.core.$loose>;
