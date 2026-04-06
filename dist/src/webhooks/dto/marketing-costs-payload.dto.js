"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingCostsPayloadSchema = void 0;
const zod_1 = require("zod");
const moneyMaybe = zod_1.z
    .union([zod_1.z.number(), zod_1.z.string()])
    .optional()
    .nullable()
    .transform((v) => v);
exports.MarketingCostsPayloadSchema = zod_1.z
    .object({
    sale_acc_id: zod_1.z.string().optional().nullable(),
    saleId: zod_1.z.string().optional().nullable(),
    sale_external_id: zod_1.z.string().optional().nullable(),
    batchId: zod_1.z.string().optional().nullable(),
    batch_id: zod_1.z.string().optional().nullable(),
    date: zod_1.z.string().optional().nullable(),
    zns_cost: moneyMaybe,
    call_cost: moneyMaybe,
    email_cost: moneyMaybe,
    zns: moneyMaybe,
    call: moneyMaybe,
    email: moneyMaybe,
    red_cost: moneyMaybe,
})
    .passthrough();
//# sourceMappingURL=marketing-costs-payload.dto.js.map