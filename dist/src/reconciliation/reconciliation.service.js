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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ReconciliationService = class ReconciliationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listUnmatchedTransactions() {
        return this.prisma.transaction.findMany({
            where: { leadId: null },
            orderBy: { transactionDate: 'desc' },
            select: {
                id: true,
                transactionId: true,
                amount: true,
                content: true,
                transactionDate: true,
                phoneSender: true,
                verificationStatus: true,
                isVerified: true,
            },
        });
    }
    stageFromAmount(amount, isVerified) {
        if (!isVerified)
            return null;
        if (amount.eq(new client_1.Prisma.Decimal(97000))) {
            return client_1.LeadPipelineStage.PAYMENT_SUCCESS;
        }
        if (amount.gte(new client_1.Prisma.Decimal(1000000))) {
            return client_1.LeadPipelineStage.PAYMENT_SUCCESS;
        }
        return null;
    }
    async attachTransactionToLead(input) {
        const tx = await this.prisma.transaction.findUnique({
            where: { transactionId: input.transactionId },
        });
        if (!tx) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (tx.leadId) {
            throw new common_1.BadRequestException('Transaction already matched');
        }
        const stage = this.stageFromAmount(tx.amount, tx.isVerified);
        return this.prisma.$transaction(async (prismaTx) => {
            await prismaTx.transaction.update({
                where: { transactionId: input.transactionId },
                data: {
                    leadId: input.leadId,
                    phoneSender: tx.phoneSender,
                    verificationStatus: tx.isVerified
                        ? client_1.VerificationStatus.AUTO
                        : client_1.VerificationStatus.PENDING,
                    isVerified: tx.isVerified,
                },
            });
            if (stage) {
                await prismaTx.lead.update({
                    where: { id: input.leadId },
                    data: {
                        pipelineStage: stage,
                        lastActivityAt: new Date(),
                    },
                });
            }
            return { ok: true };
        });
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map