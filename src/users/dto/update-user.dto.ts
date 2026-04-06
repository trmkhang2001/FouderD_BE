import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
  role: z.enum(['ADMIN', 'MANAGER', 'SALE']),
  saleAccId: z.string().optional().nullable(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

