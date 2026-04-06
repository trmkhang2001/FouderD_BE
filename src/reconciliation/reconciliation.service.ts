import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeadPipelineStage, Prisma, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import type { AttachTransactionInput } from './dto/attach-transaction.dto';

@Injectable()
export class ReconciliationService {
  constructor(private readonly prisma: PrismaService) {}

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

  private stageFromAmount(amount: Prisma.Decimal, isVerified: boolean) {
    if (!isVerified) return null;
    if (amount.eq(new Prisma.Decimal(97000))) {
      return LeadPipelineStage.PAYMENT_SUCCESS;
    }
    if (amount.gte(new Prisma.Decimal(1000000))) {
      return LeadPipelineStage.PAYMENT_SUCCESS;
    }
    return null;
  }

  async attachTransactionToLead(input: AttachTransactionInput) {
    const tx = await this.prisma.transaction.findUnique({
      where: { transactionId: input.transactionId },
    });

    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }
    if (tx.leadId) {
      throw new BadRequestException('Transaction already matched');
    }

    const stage = this.stageFromAmount(tx.amount, tx.isVerified);

    return this.prisma.$transaction(async (prismaTx) => {
      await prismaTx.transaction.update({
        where: { transactionId: input.transactionId },
        data: {
          leadId: input.leadId,
          phoneSender: tx.phoneSender,
          verificationStatus: tx.isVerified
            ? VerificationStatus.AUTO
            : VerificationStatus.PENDING,
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
}

