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
exports.TransactionsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsRepository = class TransactionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.transaction.create({
            data: {
                transactionId: data.transactionId,
                amount: data.amount,
                content: data.content,
                transactionDate: data.transactionDate,
                phoneSender: data.phoneSender,
                verificationStatus: data.verificationStatus,
                isVerified: data.isVerified,
                leadId: data.leadId,
            },
        });
    }
    findByTransactionId(transactionId) {
        return this.prisma.transaction.findUnique({
            where: { transactionId },
        });
    }
    sumVerifiedAmount(from, to) {
        return this.prisma.transaction.aggregate({
            where: {
                isVerified: true,
                transactionDate: {
                    gte: from,
                    lte: to,
                },
            },
            _sum: { amount: true },
        });
    }
};
exports.TransactionsRepository = TransactionsRepository;
exports.TransactionsRepository = TransactionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsRepository);
//# sourceMappingURL=transactions.repository.js.map