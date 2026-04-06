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
exports.DailyReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const daily_reports_repository_1 = require("./daily-reports.repository");
const upsert_daily_report_dto_1 = require("./dto/upsert-daily-report.dto");
function parseUtcDateOnly(ymd) {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
}
let DailyReportsService = class DailyReportsService {
    reports;
    constructor(reports) {
        this.reports = reports;
    }
    submit(user, raw) {
        const body = upsert_daily_report_dto_1.UpsertDailyReportSchema.parse(raw);
        let saleId = user.sub;
        if (body.sale_id) {
            if (user.role !== client_1.Role.ADMIN) {
                throw new common_1.ForbiddenException('Only ADMIN can set sale_id');
            }
            saleId = body.sale_id;
        }
        else if (user.role === client_1.Role.MANAGER) {
            throw new common_1.ForbiddenException('MANAGER must not create reports via this endpoint');
        }
        const date = parseUtcDateOnly(body.date);
        const period = body.period;
        const totalDepositYmm = typeof body.total_deposit_ymm === 'string'
            ? new client_1.Prisma.Decimal(body.total_deposit_ymm)
            : new client_1.Prisma.Decimal(body.total_deposit_ymm);
        return this.reports.upsert({
            saleId,
            date,
            period,
            totalLeadsReceived: body.total_leads_received,
            totalContacted: body.total_contacted,
            totalClosed97k: body.total_closed_97k,
            totalDepositYmm,
            totalZaloJoined: body.total_zalo_joined,
        });
    }
    list(user, query) {
        const from = query.from ? parseUtcDateOnly(query.from) : undefined;
        const to = query.to ? parseUtcDateOnly(query.to) : undefined;
        if (user.role === client_1.Role.SALE) {
            return this.reports.findManyForSale(user.sub, from, to);
        }
        return this.reports.findManyAll(from, to);
    }
};
exports.DailyReportsService = DailyReportsService;
exports.DailyReportsService = DailyReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [daily_reports_repository_1.DailyReportsRepository])
], DailyReportsService);
//# sourceMappingURL=daily-reports.service.js.map