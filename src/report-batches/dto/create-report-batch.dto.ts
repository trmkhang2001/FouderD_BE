import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ymdRegex = /^\d{4}-\d{2}-\d{2}$/;

export const CreateReportBatchSchema = z
  .object({
    name: z.string().min(1).max(120),
    startDate: z.string().regex(ymdRegex, 'Use YYYY-MM-DD'),
    endDate: z.string().regex(ymdRegex, 'Use YYYY-MM-DD'),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: 'endDate must be >= startDate',
    path: ['endDate'],
  });

export class CreateReportBatchDto extends createZodDto(
  CreateReportBatchSchema,
) {}

