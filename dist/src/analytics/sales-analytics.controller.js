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
exports.SalesAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const sales_analytics_service_1 = require("./sales-analytics.service");
const swagger_1 = require("@nestjs/swagger");
let SalesAnalyticsController = class SalesAnalyticsController {
    salesAnalytics;
    constructor(salesAnalytics) {
        this.salesAnalytics = salesAnalytics;
    }
    overview(user, from, to, saleId) {
        return this.salesAnalytics.overview(user, { from, to, saleId });
    }
};
exports.SalesAnalyticsController = SalesAnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('saleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], SalesAnalyticsController.prototype, "overview", null);
exports.SalesAnalyticsController = SalesAnalyticsController = __decorate([
    (0, common_1.Controller)('analytics/sales'),
    (0, swagger_1.ApiTags)('analytics/sales'),
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.SALE),
    __metadata("design:paramtypes", [sales_analytics_service_1.SalesAnalyticsService])
], SalesAnalyticsController);
//# sourceMappingURL=sales-analytics.controller.js.map