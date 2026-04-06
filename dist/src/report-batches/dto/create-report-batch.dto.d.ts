import { z } from 'zod';
export declare const CreateReportBatchSchema: z.ZodObject<{
    name: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>;
declare const CreateReportBatchDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>, false>;
export declare class CreateReportBatchDto extends CreateReportBatchDto_base {
}
export {};
