import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeadPipelineStage, Prisma, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import { LeadsRepository } from '../leads/leads.repository';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { LadiworkPayloadSchema } from './dto/ladiwork-payload.dto';
import { SepayPayloadSchema } from './dto/sepay-payload.dto';
import { LadipageSnapshotPayloadSchema } from './dto/ladipage-payload.dto';
import { MarketingCostsPayloadSchema } from './dto/marketing-costs-payload.dto';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly users: UsersRepository,
    private readonly leads: LeadsRepository,
    private readonly transactions: TransactionsRepository,
  ) {}

  assertLadiworkSecret(secret: string | undefined) {
    const expected = this.config.getOrThrow<string>('LADIWORK_WEBHOOK_SECRET');
    if (!secret || secret !== expected) {
      throw new UnauthorizedException('Invalid webhook secret');
    }
  }

  assertSepaySecret(secret: string | undefined) {
    const expected = this.config.getOrThrow<string>('SEPAY_WEBHOOK_SECRET');
    if (!secret || secret !== expected) {
      throw new UnauthorizedException('Invalid webhook secret');
    }
  }

  assertLadipageSecret(secret: string | undefined) {
    const expected = this.config.getOrThrow<string>('LADIPAGE_WEBHOOK_SECRET');
    if (!secret || secret !== expected) {
      throw new UnauthorizedException('Invalid webhook secret');
    }
  }

  assertMarketingCostsSecret(secret: string | undefined) {
    const expected =
      this.config.getOrThrow<string>('MARKETING_COSTS_WEBHOOK_SECRET');
    if (!secret || secret !== expected) {
      throw new UnauthorizedException('Invalid webhook secret');
    }
  }

  async syncLadiwork(secret: string | undefined, raw: unknown) {
    this.assertLadiworkSecret(secret);
    const body = LadiworkPayloadSchema.parse(raw);
    let saleId: string | null = null;
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

  private extractPhoneNumberFromContent(content: string): string | null {
    // Typical Sepay content contains the phone number somewhere in the message.
    // We keep this intentionally permissive; reconciliation UI can correct mismatches.
    const match = content.match(/(\+?\d{9,15})/);
    return match?.[1] ?? null;
  }

  private stageFromAmount(amount: Prisma.Decimal, isVerified: boolean) {
    if (!isVerified) {
      return null;
    }
    if (amount.eq(new Prisma.Decimal(97000))) {
      return LeadPipelineStage.PAYMENT_SUCCESS;
    }
    if (amount.gte(new Prisma.Decimal(1000000))) {
      return LeadPipelineStage.PAYMENT_SUCCESS;
    }
    return null;
  }

  async logSepay(secret: string | undefined, raw: unknown) {
    this.assertSepaySecret(secret);
    const body = SepayPayloadSchema.parse(raw);

    const amount =
      typeof body.amount === 'string'
        ? new Prisma.Decimal(body.amount)
        : new Prisma.Decimal(body.amount);
    const transactionDate =
      body.transaction_date instanceof Date
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

    // Stage update is only allowed when:
    // - lead was found
    // - transaction is verified by Sepay payload
    const stage = leadId ? this.stageFromAmount(amount, isVerified) : null;

    const verificationStatus: VerificationStatus = leadId
      ? isVerified
        ? VerificationStatus.AUTO
        : VerificationStatus.PENDING
      : VerificationStatus.PENDING;

    // Idempotency by transaction_id
    const transactionId = body.transaction_id;

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { transactionId },
      });
      if (existing) {
        // If it was previously unmatched, and we now have a stage-eligible match, reconcile it.
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

  async syncLadipageSnapshot(
    secret: string | undefined,
    raw: unknown,
  ) {
    this.assertLadipageSecret(secret);
    const body = LadipageSnapshotPayloadSchema.parse(raw);

    const saleAccId =
      body.sale_acc_id ?? body.saleId ?? body.sale_external_id ?? null;

    if (!saleAccId || typeof saleAccId !== 'string') {
      throw new UnauthorizedException('Missing sale identifier');
    }

    const saleUser = await this.users.findBySaleAccId(saleAccId);
    if (!saleUser) {
      throw new UnauthorizedException('Unknown sale_acc_id');
    }

    const source = 'LADIPAGE';

    // Accept either ISO string or yyyy-mm-dd. We store date-only in UTC.
    const dateStr = typeof body.date === 'string' ? body.date : null;
    const date = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(date.getTime())) {
      throw new UnauthorizedException('Invalid date');
    }

    // Prisma Json type doesn't accept `unknown` at compile time.
    const payloadJson = raw as any;

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

  async syncMarketingCosts(secret: string | undefined, raw: unknown) {
    this.assertMarketingCostsSecret(secret);
    const body = MarketingCostsPayloadSchema.parse(raw);

    const source = 'MARKETING_COSTS';

    const explicitBatchId =
      body.batchId ?? body.batch_id ?? null;

    const dateStr = typeof body.date === 'string' ? body.date : null;
    const date = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(date.getTime())) {
      throw new UnauthorizedException('Invalid date');
    }

    const batchId =
      explicitBatchId && typeof explicitBatchId === 'string'
        ? explicitBatchId
        : (
            await this.prisma.reportBatch.findFirst({
              where: {
                startDate: { lte: date },
                endDate: { gte: date },
              },
              orderBy: { startDate: 'desc' },
              select: { id: true },
            })
          )?.id;

    if (!batchId) {
      throw new UnauthorizedException(
        'Missing batchId (or no batch matches provided date)',
      );
    }

    const payloadJson = raw as any;

    // Idempotency by (batch_id, source).
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
}
