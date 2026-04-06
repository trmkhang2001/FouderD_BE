import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SepayPayloadSchema = z.object({
  amount: z.union([z.number(), z.string()]),
  content: z.string().optional().nullable(),
  transaction_date: z.coerce.date(),
  transaction_id: z.string(),
  phone_sender: z.string().optional().nullable(),
  is_verified: z.boolean().optional(),
});

export class SepayPayloadDto extends createZodDto(SepayPayloadSchema) {}
