"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = exports.CreateUserSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1),
    role: zod_1.z.enum(['ADMIN', 'MANAGER', 'SALE']),
    saleAccId: zod_1.z.string().optional().nullable(),
});
class CreateUserDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateUserSchema) {
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map