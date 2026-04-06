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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async conversionRates(from, to) {
        const totalLeads = await this.prisma.lead.count({
            where: {
                createdAt: {
                    gte: from,
                    lte: to,
                },
            },
        });
        const fastBuyerRows = await this.prisma.$queryRaw `
      SELECT COUNT(*)::bigint AS count
      FROM leads l
      WHERE l.created_at >= ${from}
        AND l.created_at <= ${to}
        AND EXISTS (
          SELECT 1
          FROM transactions t
          WHERE t.lead_id = l.id
            AND t.is_verified = true
            AND t.transaction_date >= l.created_at
            AND t.transaction_date <= l.created_at + interval '5 minutes'
        )
    `;
        const newBuyers5m = Number(fastBuyerRows[0]?.count ?? 0);
        const reportAgg = await this.prisma.dailyReport.aggregate({
            where: {
                date: {
                    gte: from,
                    lte: to,
                },
            },
            _sum: {
                totalZaloJoined: true,
                totalClosed97k: true,
                totalDepositYmm: true,
            },
        });
        const totalZalo = reportAgg._sum.totalZaloJoined ?? 0;
        const totalPaid97k = reportAgg._sum.totalClosed97k ?? 0;
        const totalDeposit = reportAgg._sum.totalDepositYmm ?? new client_1.Prisma.Decimal(0);
        const depositSum = await this.prisma.transaction.aggregate({
            where: {
                isVerified: true,
                transactionDate: {
                    gte: from,
                    lte: to,
                },
            },
            _sum: { amount: true },
        });
        const depositAmount = depositSum._sum.amount ?? new client_1.Prisma.Decimal(0);
        const conv5m = totalLeads > 0 ? newBuyers5m / totalLeads : null;
        const convZalo = totalPaid97k > 0 ? totalZalo / totalPaid97k : null;
        const depositNum = depositAmount.toNumber();
        const convDeposit = totalLeads > 0 ? depositNum / totalLeads : null;
        return {
            range: {
                from: from.toISOString(),
                to: to.toISOString(),
            },
            total_leads: totalLeads,
            new_buyers_within_5_minutes: newBuyers5m,
            conversion_new_buyers_within_5_min: conv5m,
            total_zalo_joined: totalZalo,
            total_paid_97k: totalPaid97k,
            conversion_zalo_per_paid_97k: convZalo,
            total_deposit_amount: depositAmount.toFixed(2),
            conversion_deposit_per_lead: convDeposit,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map