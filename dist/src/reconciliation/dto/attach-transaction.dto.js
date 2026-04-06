"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachTransactionDto = exports.AttachTransactionSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.AttachTransactionSchema = zod_1.z.object({
    transactionId: zod_1.z.string(),
    leadId: zod_1.z.string(),
});
class AttachTransactionDto extends (0, nestjs_zod_1.createZodDto)(exports.AttachTransactionSchema) {
}
exports.AttachTransactionDto = AttachTransactionDto;
//# sourceMappingURL=attach-transaction.dto.js.map