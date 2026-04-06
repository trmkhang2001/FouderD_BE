import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateLeadSchema = z.object({
  name: z.string().min(1).optional().nullable(),
  source: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  dealAmount: z.preprocess((raw) => {
    if (raw == null || raw === '') return null;
    const n =
      typeof raw === 'number'
        ? raw
        : Number(String(raw).replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : null;
  }, z.number().optional().nullable()),
});

export class UpdateLeadDto extends createZodDto(UpdateLeadSchema) {}

export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;

