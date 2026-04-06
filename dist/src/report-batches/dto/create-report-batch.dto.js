"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReportBatchDto = exports.CreateReportBatchSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ymdRegex = /^\d{4}-\d{2}-\d{2}$/;
exports.CreateReportBatchSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1).max(120),
    startDate: zod_1.z.string().regex(ymdRegex, 'Use YYYY-MM-DD'),
    endDate: zod_1.z.string().regex(ymdRegex, 'Use YYYY-MM-DD'),
})
    .refine((v) => v.endDate >= v.startDate, {
    message: 'endDate must be >= startDate',
    path: ['endDate'],
});
class CreateReportBatchDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateReportBatchSchema) {
}
exports.CreateReportBatchDto = CreateReportBatchDto;
//# sourceMappingURL=create-report-batch.dto.js.map