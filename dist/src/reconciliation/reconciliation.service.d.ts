import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AttachTransactionInput } from './dto/attach-transaction.dto';
export declare class ReconciliationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listUnmatchedTransactions(): Promise<{
        id: string;
        transactionId: string;
        amount: Prisma.Decimal;
        content: string | null;
        transactionDate: Date;
        phoneSender: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        isVerified: boolean;
    }[]>;
    private stageFromAmount;
    attachTransactionToLead(input: AttachTransactionInput): Promise<{
        ok: boolean;
    }>;
}
