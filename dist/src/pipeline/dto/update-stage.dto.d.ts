import { z } from 'zod';
export declare const UpdateStageSchema: z.ZodObject<{
    pipelineStage: z.ZodEnum<{
        NEW: "NEW";
        CONTACTED: "CONTACTED";
        PERSUADING: "PERSUADING";
        PAYMENT_SUCCESS: "PAYMENT_SUCCESS";
        ZALO_JOINED: "ZALO_JOINED";
        REFUND: "REFUND";
    }>;
    transactionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const UpdateStageDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    pipelineStage: z.ZodEnum<{
        NEW: "NEW";
        CONTACTED: "CONTACTED";
        PERSUADING: "PERSUADING";
        PAYMENT_SUCCESS: "PAYMENT_SUCCESS";
        ZALO_JOINED: "ZALO_JOINED";
        REFUND: "REFUND";
    }>;
    transactionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class UpdateStageDto extends UpdateStageDto_base {
}
export type UpdateStageInput = z.infer<typeof UpdateStageSchema>;
export {};
