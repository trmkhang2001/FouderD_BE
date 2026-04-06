import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['ADMIN', 'MANAGER', 'SALE']),
  saleAccId: z.string().optional().nullable(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
