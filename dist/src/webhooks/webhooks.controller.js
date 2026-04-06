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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const webhooks_service_1 = require("./webhooks.service");
const swagger_1 = require("@nestjs/swagger");
let WebhooksController = class WebhooksController {
    webhooks;
    constructor(webhooks) {
        this.webhooks = webhooks;
    }
    ladiwork(secret, body) {
        return this.webhooks.syncLadiwork(secret, body);
    }
    sepay(secret, body) {
        return this.webhooks.logSepay(secret, body);
    }
    ladipage(secret, body) {
        return this.webhooks.syncLadipageSnapshot(secret, body);
    }
    marketingCosts(secret, body) {
        return this.webhooks.syncMarketingCosts(secret, body);
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('ladiwork'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook: sync leads from Ladiwork' }),
    __param(0, (0, common_1.Headers)('x-webhook-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "ladiwork", null);
__decorate([
    (0, common_1.Post)('sepay'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook: log verified transactions from Sepay' }),
    __param(0, (0, common_1.Headers)('x-webhook-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "sepay", null);
__decorate([
    (0, common_1.Post)('ladipage'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook: upsert Ladipage snapshot into DB' }),
    __param(0, (0, common_1.Headers)('x-webhook-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "ladipage", null);
__decorate([
    (0, common_1.Post)('marketing-costs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Webhook: upsert marketing costs (ZNS/Call/Email) for a report batch',
    }),
    __param(0, (0, common_1.Headers)('x-webhook-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "marketingCosts", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map