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
exports.LeadsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadsRepository = class LeadsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertByPhone(data) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.lead.findUnique({ where: { phone: data.phone } });
            if (!existing) {
                return tx.lead.create({
                    data: {
                        phone: data.phone,
                        name: data.name ?? null,
                        source: data.source ?? null,
                        tag: data.tag ?? null,
                        status: data.status ?? null,
                        saleId: data.saleId ?? null,
                    },
                });
            }
            const finalSaleId = existing.saleId ?? (data.saleId ?? null);
            return tx.lead.update({
                where: { id: existing.id },
                data: {
                    name: data.name ?? undefined,
                    source: data.source ?? undefined,
                    tag: data.tag ?? undefined,
                    status: data.status ?? undefined,
                    saleId: finalSaleId,
                },
            });
        });
    }
    findManyForRole(params) {
        const where = {};
        if (params.saleId) {
            where.saleId = params.saleId;
        }
        return this.prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: params.skip,
            take: params.take,
            include: {
                sale: { select: { id: true, name: true, email: true } },
            },
        });
    }
    count(where) {
        return this.prisma.lead.count({ where });
    }
    findByPhone(phone) {
        return this.prisma.lead.findUnique({ where: { phone } });
    }
    findById(id) {
        return this.prisma.lead.findUnique({ where: { id } });
    }
    deleteById(id) {
        return this.prisma.lead.delete({ where: { id } });
    }
    updateById(id, data) {
        return this.prisma.lead.update({
            where: { id },
            data: {
                name: data.name ?? undefined,
                source: data.source ?? undefined,
                tag: data.tag ?? undefined,
                status: data.status ?? undefined,
                ...(data.dealAmount !== undefined
                    ? {
                        dealAmount: data.dealAmount == null
                            ? null
                            : new client_1.Prisma.Decimal(data.dealAmount),
                    }
                    : {}),
                lastActivityAt: data.lastActivityAt ?? undefined,
            },
        });
    }
};
exports.LeadsRepository = LeadsRepository;
exports.LeadsRepository = LeadsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsRepository);
//# sourceMappingURL=leads.repository.js.map