import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpsertDailyReportSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  period: z.enum(['DAILY', 'WEEKLY']),
  total_leads_received: z.number().int().min(0),
  total_contacted: z.number().int().min(0),
  total_closed_97k: z.number().int().min(0),
  total_deposit_ymm: z.union([z.number(), z.string()]),
  total_zalo_joined: z.number().int().min(0),
  sale_id: z.string().uuid().optional(),
});

export class UpsertDailyReportDto extends createZodDto(
  UpsertDailyReportSchema,
) {}
