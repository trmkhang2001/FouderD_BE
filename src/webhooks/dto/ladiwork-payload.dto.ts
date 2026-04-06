import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LadiworkPayloadSchema = z.object({
  phone: z.string().min(8),
  name: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  sale_acc_id: z.string().optional().nullable(),
});

export class LadiworkPayloadDto extends createZodDto(LadiworkPayloadSchema) {}
