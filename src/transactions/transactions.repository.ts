import { Injectable } from '@nestjs/common';
import { Prisma, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    transactionId: string;
    amount: Prisma.Decimal;
    content?: string | null;
    transactionDate: Date;
    phoneSender?: string | null;
    verificationStatus: VerificationStatus;
    isVerified: boolean;
    leadId?: string | null;
  }) {
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

  findByTransactionId(transactionId: string) {
    return this.prisma.transaction.findUnique({
      where: { transactionId },
    });
  }

  sumVerifiedAmount(from?: Date, to?: Date) {
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
}
