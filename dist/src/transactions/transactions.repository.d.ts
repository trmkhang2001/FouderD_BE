import { Prisma, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class TransactionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        transactionId: string;
        amount: Prisma.Decimal;
        content?: string | null;
        transactionDate: Date;
        phoneSender?: string | null;
        verificationStatus: VerificationStatus;
        isVerified: boolean;
        leadId?: string | null;
    }): Prisma.Prisma__TransactionClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findByTransactionId(transactionId: string): Prisma.Prisma__TransactionClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    sumVerifiedAmount(from?: Date, to?: Date): Prisma.PrismaPromise<Prisma.GetTransactionAggregateType<{
        where: {
            isVerified: true;
            transactionDate: {
                gte: Date | undefined;
                lte: Date | undefined;
            };
        };
        _sum: {
            amount: true;
        };
    }>>;
}
