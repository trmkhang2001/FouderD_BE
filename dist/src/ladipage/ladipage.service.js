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
exports.LadipageService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function parseDateOnlyMaybe(date) {
    if (!date)
        return null;
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
        throw new common_1.BadRequestException('Invalid date');
    }
    return d;
}
function parseMoneyMaybe(v) {
    if (v === null || v === undefined)
        return null;
    if (typeof v === 'number')
        return Number.isFinite(v) ? v : null;
    const n = Number.parseFloat(String(v));
    return Number.isNaN(n) ? null : n;
}
function parseMarketingCosts(payload) {
    if (!payload) {
        return {
            znsCost: null,
            callCost: null,
            emailCost: null,
            totalCost: null,
        };
    }
    const root = payload?.costs ?? payload?.marketing_costs ?? payload?.data ?? payload;
    const znsCost = parseMoneyMaybe(root?.zns_cost ?? root?.znsCost ?? root?.zns ?? root?.ZNS);
    const callCost = parseMoneyMaybe(root?.call_cost ?? root?.callCost ?? root?.call ?? root?.CALL);
    const emailCost = parseMoneyMaybe(root?.email_cost ?? root?.emailCost ?? root?.email ?? root?.EMAIL);
    const values = [znsCost, callCost, emailCost].filter((x) => x != null);
    const totalCost = values.length ? values.reduce((a, b) => a + b, 0) : null;
    return { znsCost, callCost, emailCost, totalCost };
}
function normalizeStages(stagesInput) {
    if (!stagesInput)
        return [];
    if (Array.isArray(stagesInput)) {
        return stagesInput
            .map((s) => {
            const key = String(s?.key ?? s?.id ?? s?.name ?? s?.label ?? '');
            if (!key)
                return null;
            const label = String(s?.label ?? s?.name ?? key);
            const rawCount = s?.count ?? s?.dealCount ?? s?.total ?? 0;
            const count = typeof rawCount === 'number'
                ? rawCount
                : Number.parseInt(String(rawCount), 10) || 0;
            const rawAmount = s?.amount ?? s?.totalAmount ?? null;
            const amount = rawAmount == null ? null : String(rawAmount ?? '').trim() || null;
            return { key, label, count, amount };
        })
            .filter(Boolean);
    }
    if (typeof stagesInput === 'object') {
        const record = stagesInput;
        return Object.entries(record).map(([key, value]) => {
            const v = value ?? {};
            const label = String(v?.label ?? v?.name ?? key);
            const rawCount = typeof v === 'number' ? v : v?.count ?? v?.dealCount ?? v?.total ?? 0;
            const count = typeof rawCount === 'number'
                ? rawCount
                : Number.parseInt(String(rawCount), 10) || 0;
            const rawAmount = v?.amount ?? v?.totalAmount ?? null;
            const amount = rawAmount == null ? null : String(rawAmount ?? '').trim() || null;
            return { key, label, count, amount };
        });
    }
    return [];
}
let LadipageService = class LadipageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async pipeline(opts) {
        const { user } = opts;
        const dateOnly = parseDateOnlyMaybe(opts.date);
        const latestRequested = opts.latest === undefined
            ? !opts.date
            : opts.latest === 'true' || opts.latest === '1';
        const batch = opts.batchId
            ? await this.prisma.reportBatch.findUnique({
                where: { id: opts.batchId },
            })
            : null;
        if (opts.batchId && !batch) {
            throw new common_1.BadRequestException('Invalid batchId');
        }
        const ladipageSource = 'LADIPAGE';
        const rangeFrom = batch?.startDate ?? dateOnly ?? null;
        const rangeTo = batch?.endDate ?? dateOnly ?? null;
        const exactDate = !latestRequested && dateOnly && !batch ? dateOnly : null;
        const saleIds = user.role === client_1.Role.SALE
            ? [user.sub]
            : opts.saleId
                ? [opts.saleId]
                : (await this.prisma.user.findMany({
                    where: { role: client_1.Role.SALE },
                    select: { id: true },
                })).map((u) => u.id);
        const users = await this.prisma.user.findMany({
            where: { id: { in: saleIds } },
            select: { id: true, name: true, email: true },
        });
        const userById = new Map(users.map((u) => [u.id, u]));
        const snapshotsWhereBase = {
            saleId: { in: saleIds },
            source: ladipageSource,
        };
        const ladipageSnapshots = exactDate
            ? await this.prisma.externalPipelineSnapshot.findMany({
                where: { ...snapshotsWhereBase, date: exactDate },
                select: { saleId: true, payload: true, updatedAt: true },
            })
            : await this.prisma.externalPipelineSnapshot.findMany({
                where: {
                    ...snapshotsWhereBase,
                    ...(rangeFrom && rangeTo ? { date: { gte: rangeFrom, lte: rangeTo } } : {}),
                },
                orderBy: [{ date: 'desc' }, { updatedAt: 'desc' }],
                distinct: ['saleId'],
                select: { saleId: true, payload: true, updatedAt: true },
            });
        const ladipageSnapBySaleId = new Map(ladipageSnapshots.map((s) => [s.saleId, s]));
        const marketingCosts = batch
            ? await this.prisma.batchMarketingCostSnapshot.findUnique({
                where: { batchId_source: { batchId: batch.id, source: 'MARKETING_COSTS' } },
            })
            : null;
        const parsedBatchMarketingCosts = marketingCosts
            ? parseMarketingCosts(marketingCosts.payload)
            : null;
        const sales = saleIds.map((saleId) => {
            const meta = userById.get(saleId);
            const snap = ladipageSnapBySaleId.get(saleId);
            const rawPayload = snap?.payload;
            const stagesRaw = rawPayload?.stages ?? rawPayload?.data?.stages ?? null;
            const stagesNoRatio = normalizeStages(stagesRaw);
            const total = stagesNoRatio.reduce((acc, s) => acc + s.count, 0);
            const stages = stagesNoRatio.map((s) => ({
                ...s,
                ratio: total > 0 ? s.count / total : null,
            }));
            return {
                saleId,
                saleName: meta?.name ?? null,
                saleEmail: meta?.email ?? '',
                stages,
                total,
                updatedAt: snap?.updatedAt ? snap.updatedAt.toISOString() : null,
            };
        });
        const responseDate = rangeTo?.toISOString() ?? new Date().toISOString();
        return {
            date: responseDate,
            sales,
            batchMarketingCosts: parsedBatchMarketingCosts
                ? {
                    ...parsedBatchMarketingCosts,
                    updatedAt: marketingCosts?.updatedAt
                        ? marketingCosts.updatedAt.toISOString()
                        : null,
                }
                : null,
        };
    }
};
exports.LadipageService = LadipageService;
exports.LadipageService = LadipageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LadipageService);
//# sourceMappingURL=ladipage.service.js.map