import { z } from 'zod';
export declare const AttachTransactionSchema: z.ZodObject<{
    transactionId: z.ZodString;
    leadId: z.ZodString;
}, z.core.$strip>;
declare const AttachTransactionDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    transactionId: z.ZodString;
    leadId: z.ZodString;
}, z.core.$strip>, false>;
export declare class AttachTransactionDto extends AttachTransactionDto_base {
}
export type AttachTransactionInput = z.infer<typeof AttachTransactionSchema>;
export {};
