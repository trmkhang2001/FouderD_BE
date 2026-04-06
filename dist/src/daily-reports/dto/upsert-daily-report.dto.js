"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertDailyReportDto = exports.UpsertDailyReportSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpsertDailyReportSchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    period: zod_1.z.enum(['DAILY', 'WEEKLY']),
    total_leads_received: zod_1.z.number().int().min(0),
    total_contacted: zod_1.z.number().int().min(0),
    total_closed_97k: zod_1.z.number().int().min(0),
    total_deposit_ymm: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    total_zalo_joined: zod_1.z.number().int().min(0),
    sale_id: zod_1.z.string().uuid().optional(),
});
class UpsertDailyReportDto extends (0, nestjs_zod_1.createZodDto)(exports.UpsertDailyReportSchema) {
}
exports.UpsertDailyReportDto = UpsertDailyReportDto;
//# sourceMappingURL=upsert-daily-report.dto.js.map