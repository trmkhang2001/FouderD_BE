import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AttachTransactionSchema = z.object({
  transactionId: z.string(),
  leadId: z.string(),
});

export class AttachTransactionDto extends createZodDto(
  AttachTransactionSchema,
) {}

export type AttachTransactionInput = z.infer<typeof AttachTransactionSchema>;

