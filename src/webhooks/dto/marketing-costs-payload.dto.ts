import { z } from 'zod';

const moneyMaybe = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((v) => v);

export const MarketingCostsPayloadSchema = z
  .object({
    sale_acc_id: z.string().optional().nullable(),
    saleId: z.string().optional().nullable(),
    sale_external_id: z.string().optional().nullable(),

    // Optionally attach directly to a batch.
    batchId: z.string().optional().nullable(),
    batch_id: z.string().optional().nullable(),

    // Optional yyyy-mm-dd or ISO. If omitted, backend uses today (UTC).
    date: z.string().optional().nullable(),

    // Accept multiple field aliases from external API.
    zns_cost: moneyMaybe,
    call_cost: moneyMaybe,
    email_cost: moneyMaybe,

    zns: moneyMaybe,
    call: moneyMaybe,
    email: moneyMaybe,

    // Optional extra field (kept for your "đỏ" section / other future costs).
    red_cost: moneyMaybe,
  })
  .passthrough();

