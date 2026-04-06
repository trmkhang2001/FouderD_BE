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
exports.SalesAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const STAGE_KEYS = [
    'NEW',
    'CONTACTED',
    'PERSUADING',
    'PAYMENT_SUCCESS',
    'ZALO_JOINED',
    'REFUND',
];
function parseDateOrDefault(from, to) {
    const toDate = to ? new Date(to) : new Date();
    const fromDate = from
        ? new Date(from)
        : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
        throw new common_1.BadRequestException('Invalid from/to date');
    }
    return { fromDate, toDate };
}
function initStageCounts() {
    return {
        NEW: 0,
        CONTACTED: 0,
        PERSUADING: 0,
        PAYMENT_SUCCESS: 0,
        ZALO_JOINED: 0,
        REFUND: 0,
    };
}
function initStageRatios() {
    return {
        NEW: 0,
        CONTACTED: 0,
        PERSUADING: 0,
        PAYMENT_SUCCESS: 0,
        ZALO_JOINED: 0,
        REFUND: 0,
    };
}
let SalesAnalyticsService = class SalesAnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overview(user, opts) {
        const { fromDate, toDate } = parseDateOrDefault(opts.from, opts.to);
        const saleIds = user.role === client_1.Role.SALE
            ? [user.sub]
            : opts.saleId
                ? [opts.saleId]
                : (await this.prisma.user.findMany({
                    where: { role: client_1.Role.SALE },
                    select: { id: true },
                })).map((u) => u.id);
        if (saleIds.length === 0) {
            return {
                range: {
                    from: fromDate.toISOString(),
                    to: toDate.toISOString(),
                },
                sales: [],
            };
        }
        const saleRows = await this.prisma.user.findMany({
            where: { id: { in: saleIds } },
            select: { id: true, name: true, email: true },
        });
        const saleMetaById = new Map(saleRows.map((s) => [s.id, { saleName: s.name, saleEmail: s.email }]));
        const grouped = await this.prisma.lead.groupBy({
            by: ['saleId', 'pipelineStage'],
            where: {
                saleId: { in: saleIds },
                createdAt: { gte: fromDate, lte: toDate },
            },
            _count: { _all: true },
        });
        const countBySale = new Map();
        for (const saleId of saleIds) {
            countBySale.set(saleId, initStageCounts());
        }
        for (const row of grouped) {
            const saleId = row.saleId;
            if (!saleId)
                continue;
            const stage = row.pipelineStage;
            const next = countBySale.get(saleId);
            if (!next)
                continue;
            if (stage in next) {
                next[stage] += row._count._all;
            }
        }
        const sales = saleIds
            .map((saleId) => {
            const counts = countBySale.get(saleId) ?? initStageCounts();
            const totalLeads = Object.values(counts).reduce((acc, v) => acc + v, 0);
            const ratios = initStageRatios();
            if (totalLeads > 0) {
                for (const k of STAGE_KEYS) {
                    ratios[k] = counts[k] / totalLeads;
                }
            }
            const dataNew = counts.NEW;
            const dataApproach = counts.CONTACTED;
            const dataPersuade = counts.PERSUADING;
            const dataPayment = counts.PAYMENT_SUCCESS + counts.ZALO_JOINED;
            const meta = saleMetaById.get(saleId);
            if (!meta)
                return null;
            return {
                saleId,
                saleName: meta.saleName,
                saleEmail: meta.saleEmail,
                totalLeads,
                counts,
                ratios,
                dataNew,
                dataApproach,
                dataPersuade,
                dataPayment,
            };
        })
            .filter(Boolean);
        sales.sort((a, b) => b.totalLeads - a.totalLeads);
        return {
            range: {
                from: fromDate.toISOString(),
                to: toDate.toISOString(),
            },
            sales,
        };
    }
};
exports.SalesAnalyticsService = SalesAnalyticsService;
exports.SalesAnalyticsService = SalesAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesAnalyticsService);
//# sourceMappingURL=sales-analytics.service.js.map