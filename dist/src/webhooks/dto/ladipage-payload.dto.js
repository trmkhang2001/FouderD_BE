"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LadipageSnapshotPayloadSchema = void 0;
const zod_1 = require("zod");
exports.LadipageSnapshotPayloadSchema = zod_1.z.object({
    sale_acc_id: zod_1.z.string().optional().nullable(),
    saleId: zod_1.z.string().optional().nullable(),
    sale_external_id: zod_1.z.string().optional().nullable(),
    date: zod_1.z.string().optional().nullable(),
    stages: zod_1.z.unknown().optional(),
}).passthrough();
//# sourceMappingURL=ladipage-payload.dto.js.map