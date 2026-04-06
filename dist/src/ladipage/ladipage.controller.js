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
exports.LadipageController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const ladipage_service_1 = require("./ladipage.service");
const swagger_1 = require("@nestjs/swagger");
let LadipageController = class LadipageController {
    ladipage;
    constructor(ladipage) {
        this.ladipage = ladipage;
    }
    pipeline(user, date, saleId, batchId, latest) {
        return this.ladipage.pipeline({ user, date, saleId, batchId, latest });
    }
};
exports.LadipageController = LadipageController;
__decorate([
    (0, common_1.Get)('pipeline'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conversion pipeline snapshot (latest) for sales, optionally within a batch',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('saleId')),
    __param(3, (0, common_1.Query)('batchId')),
    __param(4, (0, common_1.Query)('latest')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], LadipageController.prototype, "pipeline", null);
exports.LadipageController = LadipageController = __decorate([
    (0, swagger_1.ApiTags)('ladipage'),
    (0, common_1.Controller)('ladipage'),
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.SALE),
    __metadata("design:paramtypes", [ladipage_service_1.LadipageService])
], LadipageController);
//# sourceMappingURL=ladipage.controller.js.map