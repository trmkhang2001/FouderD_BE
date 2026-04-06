"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SepayPayloadDto = exports.SepayPayloadSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.SepayPayloadSchema = zod_1.z.object({
    amount: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    content: zod_1.z.string().optional().nullable(),
    transaction_date: zod_1.z.coerce.date(),
    transaction_id: zod_1.z.string(),
    phone_sender: zod_1.z.string().optional().nullable(),
    is_verified: zod_1.z.boolean().optional(),
});
class SepayPayloadDto extends (0, nestjs_zod_1.createZodDto)(exports.SepayPayloadSchema) {
}
exports.SepayPayloadDto = SepayPayloadDto;
//# sourceMappingURL=sepay-payload.dto.js.map