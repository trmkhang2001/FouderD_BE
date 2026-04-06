import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import { LeadsRepository } from '../leads/leads.repository';
import { TransactionsRepository } from '../transactions/transactions.repository';
export declare class WebhooksService {
    private readonly prisma;
    private readonly config;
    private readonly users;
    private readonly leads;
    private readonly transactions;
    constructor(prisma: PrismaService, config: ConfigService, users: UsersRepository, leads: LeadsRepository, transactions: TransactionsRepository);
    assertLadiworkSecret(secret: string | undefined): void;
    assertSepaySecret(secret: string | undefined): void;
    assertLadipageSecret(secret: string | undefined): void;
    assertMarketingCostsSecret(secret: string | undefined): void;
    syncLadiwork(secret: string | undefined, raw: unknown): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        source: string | null;
        tag: string | null;
        status: string | null;
        saleId: string | null;
        pipelineStage: import("@prisma/client").$Enums.LeadPipelineStage;
        dealAmount: Prisma.Decimal | null;
        lastActivityAt: Date;
    }>;
    private extractPhoneNumberFromContent;
    private stageFromAmount;
    logSepay(secret: string | undefined, raw: unknown): Promise<{
        id: string;
        createdAt: Date;
        transactionId: string;
        amount: Prisma.Decimal;
        content: string | null;
        transactionDate: Date;
        phoneSender: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        isVerified: boolean;
        leadId: string | null;
    }>;
    syncLadipageSnapshot(secret: string | undefined, raw: unknown): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        saleId: string;
        date: Date;
        payload: Prisma.JsonValue;
    }>;
    syncMarketingCosts(secret: string | undefined, raw: unknown): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        batchId: string;
        payload: Prisma.JsonValue;
    }>;
}
