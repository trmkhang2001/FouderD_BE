import { z } from 'zod';
export declare const UpsertDailyReportSchema: z.ZodObject<{
    date: z.ZodString;
    period: z.ZodEnum<{
        DAILY: "DAILY";
        WEEKLY: "WEEKLY";
    }>;
    total_leads_received: z.ZodNumber;
    total_contacted: z.ZodNumber;
    total_closed_97k: z.ZodNumber;
    total_deposit_ymm: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    total_zalo_joined: z.ZodNumber;
    sale_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const UpsertDailyReportDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    date: z.ZodString;
    period: z.ZodEnum<{
        DAILY: "DAILY";
        WEEKLY: "WEEKLY";
    }>;
    total_leads_received: z.ZodNumber;
    total_contacted: z.ZodNumber;
    total_closed_97k: z.ZodNumber;
    total_deposit_ymm: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    total_zalo_joined: z.ZodNumber;
    sale_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class UpsertDailyReportDto extends UpsertDailyReportDto_base {
}
export {};
