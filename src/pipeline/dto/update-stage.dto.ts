import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateStageSchema = z.object({
  pipelineStage: z.enum([
    'NEW',
    'CONTACTED',
    'PERSUADING',
    'PAYMENT_SUCCESS',
    'ZALO_JOINED',
    'REFUND',
  ]),
  transactionId: z.string().optional(),
});

export class UpdateStageDto extends createZodDto(UpdateStageSchema) {}

export type UpdateStageInput = z.infer<typeof UpdateStageSchema>;

