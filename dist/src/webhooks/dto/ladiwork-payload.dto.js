"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LadiworkPayloadDto = exports.LadiworkPayloadSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.LadiworkPayloadSchema = zod_1.z.object({
    phone: zod_1.z.string().min(8),
    name: zod_1.z.string().optional().nullable(),
    source: zod_1.z.string().optional().nullable(),
    tag: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().optional().nullable(),
    sale_acc_id: zod_1.z.string().optional().nullable(),
});
class LadiworkPayloadDto extends (0, nestjs_zod_1.createZodDto)(exports.LadiworkPayloadSchema) {
}
exports.LadiworkPayloadDto = LadiworkPayloadDto;
//# sourceMappingURL=ladiwork-payload.dto.js.map