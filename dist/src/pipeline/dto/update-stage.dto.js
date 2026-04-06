"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStageDto = exports.UpdateStageSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpdateStageSchema = zod_1.z.object({
    pipelineStage: zod_1.z.enum([
        'NEW',
        'CONTACTED',
        'PERSUADING',
        'PAYMENT_SUCCESS',
        'ZALO_JOINED',
        'REFUND',
    ]),
    transactionId: zod_1.z.string().optional(),
});
class UpdateStageDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateStageSchema) {
}
exports.UpdateStageDto = UpdateStageDto;
//# sourceMappingURL=update-stage.dto.js.map