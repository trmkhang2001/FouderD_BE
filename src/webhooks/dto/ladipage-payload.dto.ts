import { z } from 'zod';

export const LadipageSnapshotPayloadSchema = z.object({
  // Identify the sale rep in ERP (we map by User.saleAccId)
  sale_acc_id: z.string().optional().nullable(),
  saleId: z.string().optional().nullable(),
  sale_external_id: z.string().optional().nullable(),

  // Optional snapshot date (yyyy-mm-dd or ISO). If omitted, backend uses today (UTC).
  date: z.string().optional().nullable(),

  // Stages can be either:
  // - array of objects: [{ key, label, count, amount }]
  // - object/map: { "MỚI": { count }, "TIẾP CẬN": { count }, ... }
  stages: z.unknown().optional(),

  // Keep all other fields from Ladipage payload.
}).passthrough();

