import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const PipelineStageSchema = z.enum([
  'NEW',
  'CONTACTED',
  'PERSUADING',
  'PAYMENT_SUCCESS',
  'ZALO_JOINED',
  'REFUND',
]);

export const CreateLeadSchema = z.object({
  phone: z.preprocess((raw) => {
    // If frontend accidentally sends `undefined`, treat it as empty string
    // so we fail with a clear validation error (not invalid_type).
    const s = raw == null ? "" : typeof raw === "string" ? raw : String(raw);
    const t = s.trim();
    // Normalize Unicode digits to ASCII digits so regex `/\D/g` doesn't wipe them out.
    const t2 = t
      // Full-width digits: ０-９
      .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 0x30))
      // Arabic-Indic digits: ٠-٩
      .replace(/[٠-٩]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x0660 + 0x30))
      // Extended Arabic-Indic digits: ۰-۹
      .replace(/[۰-۹]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x06f0 + 0x30));
    const hasPlus = t2.startsWith("+");
    const digits = t2.replace(/\D/g, "");
    return (hasPlus ? "+" : "") + digits;
  }, z.string()).superRefine((v, ctx) => {
    const digits = v.replace(/\D/g, "");
    const ok = digits.length >= 6 && digits.length <= 15;
    if (!ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `phone must contain 6-15 digits (received ${digits.length})`,
        path: [],
      });
    }
  }),
  name: z.string().min(1).optional().nullable(),
  source: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  // ERP internal sale user id (Lead.saleId)
  saleId: z.string().optional().nullable(),
  pipelineStage: PipelineStageSchema.optional().nullable(),
  dealAmount: z.preprocess((raw) => {
    if (raw == null || raw === '') return null;
    const n =
      typeof raw === 'number'
        ? raw
        : Number(String(raw).replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : null;
  }, z.number().optional().nullable()),
});

export class CreateLeadDto extends createZodDto(CreateLeadSchema) {}

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

