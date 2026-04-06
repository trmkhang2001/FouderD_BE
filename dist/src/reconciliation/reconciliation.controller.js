"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nestjs_zod_1 = require("nestjs-zod");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const reconciliation_service_1 = require("./reconciliation.service");
const attach_transaction_dto_1 = require("./dto/attach-transaction.dto");
const swagger_1 = require("@nestjs/swagger");
let ReconciliationController = class ReconciliationController {
    reconciliation;
    constructor(reconciliation) {
        this.reconciliation = reconciliation;
    }
    listUnmatched() {
        return this.reconciliation.listUnmatchedTransactions();
    }
    attach(body) {
        return this.reconciliation.attachTransactionToLead(body);
    }
};
exports.ReconciliationController = ReconciliationController;
__decorate([
    (0, common_1.Get)('unmatched-transactions'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "listUnmatched", null);
__decorate([
    (0, common_1.Post)('attach-transaction'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UsePipes)(new nestjs_zod_1.ZodValidationPipe(attach_transaction_dto_1.AttachTransactionDto)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attach_transaction_dto_1.AttachTransactionDto]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "attach", null);
exports.ReconciliationController = ReconciliationController = __decorate([
    (0, common_1.Controller)('admin/reconciliation'),
    (0, swagger_1.ApiTags)('reconciliation'),
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconciliationController);
//# sourceMappingURL=reconciliation.controller.js.map