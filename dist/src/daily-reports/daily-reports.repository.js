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
exports.DailyReportsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DailyReportsRepository = class DailyReportsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    upsert(data) {
        return this.prisma.dailyReport.upsert({
            where: {
                saleId_date_period: {
                    saleId: data.saleId,
                    date: data.date,
                    period: data.period,
                },
            },
            create: data,
            update: {
                totalLeadsReceived: data.totalLeadsReceived,
                totalContacted: data.totalContacted,
                totalClosed97k: data.totalClosed97k,
                totalDepositYmm: data.totalDepositYmm,
                totalZaloJoined: data.totalZaloJoined,
            },
        });
    }
    findManyForSale(saleId, from, to) {
        return this.prisma.dailyReport.findMany({
            where: {
                saleId,
                date: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    findManyAll(from, to) {
        return this.prisma.dailyReport.findMany({
            where: {
                date: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: { date: 'desc' },
            include: { sale: { select: { id: true, name: true, email: true } } },
        });
    }
    aggregateTotals(from, to) {
        return this.prisma.dailyReport.aggregate({
            where: {
                date: {
                    gte: from,
                    lte: to,
                },
            },
            _sum: {
                totalLeadsReceived: true,
                totalContacted: true,
                totalClosed97k: true,
                totalZaloJoined: true,
                totalDepositYmm: true,
            },
        });
    }
};
exports.DailyReportsRepository = DailyReportsRepository;
exports.DailyReportsRepository = DailyReportsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DailyReportsRepository);
//# sourceMappingURL=daily-reports.repository.js.map