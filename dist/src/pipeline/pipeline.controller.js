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
exports.PipelineController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nestjs_zod_1 = require("nestjs-zod");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const update_stage_dto_1 = require("./dto/update-stage.dto");
const pipeline_service_1 = require("./pipeline.service");
const swagger_1 = require("@nestjs/swagger");
let PipelineController = class PipelineController {
    pipeline;
    constructor(pipeline) {
        this.pipeline = pipeline;
    }
    createLead(user, body) {
        console.log('[pipeline] createLead body:', body);
        return this.pipeline.createManualLead(user, body);
    }
    updateStage(user, id, body) {
        return this.pipeline.updateLeadStage(user, id, body);
    }
};
exports.PipelineController = PipelineController;
__decorate([
    (0, common_1.Post)('leads'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SALE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(new nestjs_zod_1.ZodValidationPipe(create_lead_dto_1.CreateLeadDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "createLead", null);
__decorate([
    (0, common_1.Put)('leads/:id/stage'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SALE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)(new nestjs_zod_1.ZodValidationPipe(update_stage_dto_1.UpdateStageDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_stage_dto_1.UpdateStageDto]),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "updateStage", null);
exports.PipelineController = PipelineController = __decorate([
    (0, common_1.Controller)('pipeline'),
    (0, swagger_1.ApiTags)('pipeline'),
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [pipeline_service_1.PipelineService])
], PipelineController);
//# sourceMappingURL=pipeline.controller.js.map