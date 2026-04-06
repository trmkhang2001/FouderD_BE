"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeadDto = exports.CreateLeadSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const PipelineStageSchema = zod_1.z.enum([
    'NEW',
    'CONTACTED',
    'PERSUADING',
    'PAYMENT_SUCCESS',
    'ZALO_JOINED',
    'REFUND',
]);
exports.CreateLeadSchema = zod_1.z.object({
    phone: zod_1.z.preprocess((raw) => {
        const s = raw == null ? "" : typeof raw === "string" ? raw : String(raw);
        const t = s.trim();
        const t2 = t
            .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 0x30))
            .replace(/[٠-٩]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x0660 + 0x30))
            .replace(/[۰-۹]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x06f0 + 0x30));
        const hasPlus = t2.startsWith("+");
        const digits = t2.replace(/\D/g, "");
        return (hasPlus ? "+" : "") + digits;
    }, zod_1.z.string()).superRefine((v, ctx) => {
        const digits = v.replace(/\D/g, "");
        const ok = digits.length >= 6 && digits.length <= 15;
        if (!ok) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `phone must contain 6-15 digits (received ${digits.length})`,
                path: [],
            });
        }
    }),
    name: zod_1.z.string().min(1).optional().nullable(),
    source: zod_1.z.string().optional().nullable(),
    tag: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().optional().nullable(),
    saleId: zod_1.z.string().optional().nullable(),
    pipelineStage: PipelineStageSchema.optional().nullable(),
    dealAmount: zod_1.z.preprocess((raw) => {
        if (raw == null || raw === '')
            return null;
        const n = typeof raw === 'number'
            ? raw
            : Number(String(raw).replace(/,/g, '').trim());
        return Number.isFinite(n) ? n : null;
    }, zod_1.z.number().optional().nullable()),
});
class CreateLeadDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateLeadSchema) {
}
exports.CreateLeadDto = CreateLeadDto;
//# sourceMappingURL=create-lead.dto.js.map