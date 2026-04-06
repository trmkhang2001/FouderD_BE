"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeadDto = exports.UpdateLeadSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpdateLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional().nullable(),
    source: zod_1.z.string().optional().nullable(),
    tag: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().optional().nullable(),
    dealAmount: zod_1.z.preprocess((raw) => {
        if (raw == null || raw === '')
            return null;
        const n = typeof raw === 'number'
            ? raw
            : Number(String(raw).replace(/,/g, '').trim());
        return Number.isFinite(n) ? n : null;
    }, zod_1.z.number().optional().nullable()),
});
class UpdateLeadDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateLeadSchema) {
}
exports.UpdateLeadDto = UpdateLeadDto;
//# sourceMappingURL=update-lead.dto.js.map