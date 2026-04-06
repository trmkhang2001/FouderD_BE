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
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const users_repository_1 = require("../users/users.repository");
const leads_repository_1 = require("../leads/leads.repository");
const transactions_repository_1 = require("../transactions/transactions.repository");
const ladiwork_payload_dto_1 = require("./dto/ladiwork-payload.dto");
const sepay_payload_dto_1 = require("./dto/sepay-payload.dto");
const ladipage_payload_dto_1 = require("./dto/ladipage-payload.dto");
const marketing_costs_payload_dto_1 = require("./dto/marketing-costs-payload.dto");
let WebhooksService = class WebhooksService {
    prisma;
    config;
    users;
    leads;
    transactions;
    constructor(prisma, config, users, leads, transactions) {
        this.prisma = prisma;
        this.config = config;
        this.users = users;
        this.leads = leads;
        this.transactions = transactions;
    }
    assertLadiworkSecret(secret) {
        const expected = this.config.getOrThrow('LADIWORK_WEBHOOK_SECRET');
        if (!secret || secret !== expected) {
            throw new common_1.UnauthorizedException('Invalid webhook secret');
        }
    }
    assertSepaySecret(secret) {
        const expected = this.config.getOrThrow('SEPAY_WEBHOOK_SECRET');
        if (!secret || secret !== expected) {
            throw new common_1.UnauthorizedException('Invalid webhook secret');
        }
    }
    assertLadipageSecret(secret) {
        const expected = this.config.getOrThrow('LADIPAGE_WEBHOOK_SECRET');
        if (!secret || secret !== expected) {
            throw new common_1.UnauthorizedException('Invalid webhook secret');
        }
    }
    assertMarketingCostsSecret(secret) {
        const expected = this.config.getOrThrow('MARKETING_COSTS_WEBHOOK_SECRET');
        if (!secret || secret !== expected) {
            throw new common_1.UnauthorizedException('Invalid webhook secret');
        }
    }
    async syncLadiwork(secret, raw) {
        this.assertLadiworkSecret(secret);
        const body = ladiwork_payload_dto_1.LadiworkPayloadSchema.parse(raw);
        let saleId = null;
        if (body.sale_acc_id) {
            const user = await this.users.findBySaleAccId(body.sale_acc_id);
            saleId = user?.id ?? null;
        }
        return this.leads.upsertByPhone({
            phone: body.phone,
            name: body.name,
            source: body.source ?? 'Ladiwork',
            tag: body.tag,
            status: body.status,
            saleId,
        });
    }
    extractPhoneNumberFromContent(content) {
        const match = content.match(/(\+?\d{9,15})/);
        return match?.[1] ?? null;
    }
    stageFromAmount(amount, isVerified) {
        if (!isVerified) {
            return null;
        }
        if (amount.eq(new client_1.Prisma.Decimal(97000))) {
            return client_1.LeadPipelineStage.PAYMENT_SUCCESS;
        }
        if (amount.gte(new client_1.Prisma.Decimal(1000000))) {
            return client_1.LeadPipelineStage.PAYMENT_SUCCESS;
        }
        return null;
    }
    async logSepay(secret, raw) {
        this.assertSepaySecret(secret);
        const body = sepay_payload_dto_1.SepayPayloadSchema.parse(raw);
        const amount = typeof body.amount === 'string'
            ? new client_1.Prisma.Decimal(body.amount)
            : new client_1.Prisma.Decimal(body.amount);
        const transactionDate = body.transaction_date instanceof Date
            ? body.transaction_date
            : new Date(body.transaction_date);
        const content = body.content ?? '';
        const extractedPhone = content
            ? this.extractPhoneNumberFromContent(content)
            : null;
        const phoneToMatch = extractedPhone ?? body.phone_sender ?? null;
        const isVerified = body.is_verified ?? false;
        const lead = phoneToMatch
            ? await this.leads.findByPhone(phoneToMatch)
            : null;
        const leadId = lead?.id ?? null;
        const stage = leadId ? this.stageFromAmount(amount, isVerified) : null;
        const verificationStatus = leadId
            ? isVerified
                ? client_1.VerificationStatus.AUTO
                : client_1.VerificationStatus.PENDING
            : client_1.VerificationStatus.PENDING;
        const transactionId = body.transaction_id;
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.transaction.findUnique({
                where: { transactionId },
            });
            if (existing) {
                if (!existing.leadId && leadId) {
                    if (stage) {
                        await tx.lead.update({
                            where: { id: leadId },
                            data: {
                                pipelineStage: stage,
                                lastActivityAt: new Date(),
                            },
                        });
                    }
                    return tx.transaction.update({
                        where: { transactionId },
                        data: {
                            leadId,
                            phoneSender: phoneToMatch,
                            verificationStatus,
                            isVerified,
                        },
                    });
                }
                return existing;
            }
            if (stage && leadId) {
                await tx.lead.update({
                    where: { id: leadId },
                    data: {
                        pipelineStage: stage,
                        lastActivityAt: new Date(),
                    },
                });
            }
            return tx.transaction.create({
                data: {
                    transactionId,
                    amount,
                    content: body.content,
                    transactionDate,
                    phoneSender: phoneToMatch,
                    leadId,
                    verificationStatus,
                    isVerified,
                },
            });
        });
    }
    async syncLadipageSnapshot(secret, raw) {
        this.assertLadipageSecret(secret);
        const body = ladipage_payload_dto_1.LadipageSnapshotPayloadSchema.parse(raw);
        const saleAccId = body.sale_acc_id ?? body.saleId ?? body.sale_external_id ?? null;
        if (!saleAccId || typeof saleAccId !== 'string') {
            throw new common_1.UnauthorizedException('Missing sale identifier');
        }
        const saleUser = await this.users.findBySaleAccId(saleAccId);
        if (!saleUser) {
            throw new common_1.UnauthorizedException('Unknown sale_acc_id');
        }
        const source = 'LADIPAGE';
        const dateStr = typeof body.date === 'string' ? body.date : null;
        const date = dateStr ? new Date(dateStr) : new Date();
        if (Number.isNaN(date.getTime())) {
            throw new common_1.UnauthorizedException('Invalid date');
        }
        const payloadJson = raw;
        return this.prisma.externalPipelineSnapshot.upsert({
            where: {
                saleId_source_date: {
                    saleId: saleUser.id,
                    source,
                    date: dateStr ? new Date(dateStr) : date,
                },
            },
            create: {
                saleId: saleUser.id,
                source,
                date: dateStr ? new Date(dateStr) : date,
                payload: payloadJson,
            },
            update: {
                payload: payloadJson,
            },
        });
    }
    async syncMarketingCosts(secret, raw) {
        this.assertMarketingCostsSecret(secret);
        const body = marketing_costs_payload_dto_1.MarketingCostsPayloadSchema.parse(raw);
        const source = 'MARKETING_COSTS';
        const explicitBatchId = body.batchId ?? body.batch_id ?? null;
        const dateStr = typeof body.date === 'string' ? body.date : null;
        const date = dateStr ? new Date(dateStr) : new Date();
        if (Number.isNaN(date.getTime())) {
            throw new common_1.UnauthorizedException('Invalid date');
        }
        const batchId = explicitBatchId && typeof explicitBatchId === 'string'
            ? explicitBatchId
            : (await this.prisma.reportBatch.findFirst({
                where: {
                    startDate: { lte: date },
                    endDate: { gte: date },
                },
                orderBy: { startDate: 'desc' },
                select: { id: true },
            }))?.id;
        if (!batchId) {
            throw new common_1.UnauthorizedException('Missing batchId (or no batch matches provided date)');
        }
        const payloadJson = raw;
        return this.prisma.batchMarketingCostSnapshot.upsert({
            where: {
                batchId_source: { batchId, source },
            },
            create: {
                batchId,
                source,
                payload: payloadJson,
            },
            update: {
                payload: payloadJson,
            },
        });
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        users_repository_1.UsersRepository,
        leads_repository_1.LeadsRepository,
        transactions_repository_1.TransactionsRepository])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map