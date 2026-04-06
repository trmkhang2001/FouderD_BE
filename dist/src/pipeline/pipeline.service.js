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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const users_repository_1 = require("../users/users.repository");
let PipelineService = class PipelineService {
    prisma;
    users;
    constructor(prisma, users) {
        this.prisma = prisma;
        this.users = users;
    }
    async createManualLead(user, input) {
        if (user.role !== client_1.Role.ADMIN && user.role !== client_1.Role.SALE) {
            throw new common_1.ForbiddenException('Only ADMIN or SALE can manually create leads');
        }
        let saleId = null;
        if (user.role === client_1.Role.SALE) {
            saleId = user.sub;
            if (input.saleId && input.saleId !== user.sub) {
                throw new common_1.BadRequestException('SALE can only create leads for itself');
            }
        }
        else {
            const saleUser = input.saleId
                ? await this.users.findById(input.saleId)
                : null;
            saleId = saleUser?.id ?? null;
            if (saleUser && saleUser.role !== client_1.Role.SALE) {
                throw new common_1.BadRequestException('saleId must belong to a SALE user');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.lead.findUnique({ where: { phone: input.phone } });
            const dealAmount = input.dealAmount != null
                ? new client_1.Prisma.Decimal(input.dealAmount)
                : null;
            if (existing) {
                if (existing.saleId && saleId && existing.saleId !== saleId) {
                    throw new common_1.BadRequestException('Lead phone is already assigned to another sale');
                }
                const finalSaleId = existing.saleId ?? saleId;
                const stage = input.pipelineStage ?? existing.pipelineStage ?? client_1.LeadPipelineStage.NEW;
                return tx.lead.update({
                    where: { id: existing.id },
                    data: {
                        name: input.name ?? existing.name ?? null,
                        source: input.source ?? existing.source ?? undefined,
                        tag: input.tag ?? existing.tag ?? undefined,
                        status: input.status ?? existing.status ?? undefined,
                        saleId: finalSaleId,
                        pipelineStage: stage,
                        dealAmount: input.dealAmount != null ? dealAmount : undefined,
                        lastActivityAt: new Date(),
                    },
                });
            }
            const stage = input.pipelineStage ?? client_1.LeadPipelineStage.NEW;
            return tx.lead.create({
                data: {
                    phone: input.phone,
                    name: input.name ?? null,
                    source: input.source ?? 'Manual',
                    tag: input.tag ?? null,
                    status: input.status ?? null,
                    saleId,
                    pipelineStage: stage,
                    dealAmount,
                    lastActivityAt: new Date(),
                },
            });
        });
    }
    async updateLeadStage(user, leadId, input) {
        const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
            throw new common_1.NotFoundException();
        }
        if (user.role === client_1.Role.SALE && lead.saleId !== user.sub) {
            throw new common_1.ForbiddenException('You can only update your own leads');
        }
        const target = input.pipelineStage;
        return this.prisma.$transaction(async (tx) => {
            return tx.lead.update({
                where: { id: lead.id },
                data: {
                    pipelineStage: target,
                    lastActivityAt: new Date(),
                },
            });
        });
    }
};
exports.PipelineService = PipelineService;
exports.PipelineService = PipelineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_repository_1.UsersRepository])
], PipelineService);
//# sourceMappingURL=pipeline.service.js.map