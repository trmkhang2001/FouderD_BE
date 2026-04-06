"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = exports.UpdateUserSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'MANAGER', 'SALE']),
    saleAccId: zod_1.z.string().optional().nullable(),
});
class UpdateUserDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateUserSchema) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map