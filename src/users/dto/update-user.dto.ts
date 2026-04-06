import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
  role: z.enum(['ADMIN', 'MANAGER', 'SALE']),
  email: z.string().email(),
  name: z.string().min(1).max(200),
  /** Để trống hoặc bỏ qua nếu không đổi mật khẩu */
  password: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || v.length >= 8, {
      message: 'Password tối thiểu 8 ký tự',
    }),
  saleAccId: z.string().optional().nullable(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

