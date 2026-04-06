import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type ConversionRatesResult = {
  range: { from: string; to: string };
  total_leads: number;
  new_buyers_within_5_minutes: number;
  conversion_new_buyers_within_5_min: number | null;
  total_zalo_joined: number;
  total_paid_97k: number;
  conversion_zalo_per_paid_97k: number | null;
  total_deposit_amount: string;
  conversion_deposit_per_lead: number | null;
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async conversionRates(from: Date, to: Date): Promise<ConversionRatesResult> {
    const totalLeads = await this.prisma.lead.count({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    const fastBuyerRows = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM leads l
      WHERE l.created_at >= ${from}
        AND l.created_at <= ${to}
        AND EXISTS (
          SELECT 1
          FROM transactions t
          WHERE t.lead_id = l.id
            AND t.is_verified = true
            AND t.transaction_date >= l.created_at
            AND t.transaction_date <= l.created_at + interval '5 minutes'
        )
    `;
    const newBuyers5m = Number(fastBuyerRows[0]?.count ?? 0);

    const reportAgg = await this.prisma.dailyReport.aggregate({
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        totalZaloJoined: true,
        totalClosed97k: true,
        totalDepositYmm: true,
      },
    });

    const totalZalo = reportAgg._sum.totalZaloJoined ?? 0;
    const totalPaid97k = reportAgg._sum.totalClosed97k ?? 0;
    const totalDeposit =
      reportAgg._sum.totalDepositYmm ?? new Prisma.Decimal(0);

    const depositSum = await this.prisma.transaction.aggregate({
      where: {
        isVerified: true,
        transactionDate: {
          gte: from,
          lte: to,
        },
      },
      _sum: { amount: true },
    });
    const depositAmount = depositSum._sum.amount ?? new Prisma.Decimal(0);

    const conv5m = totalLeads > 0 ? newBuyers5m / totalLeads : null;
    const convZalo = totalPaid97k > 0 ? totalZalo / totalPaid97k : null;
    const depositNum = depositAmount.toNumber();
    const convDeposit = totalLeads > 0 ? depositNum / totalLeads : null;

    return {
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      total_leads: totalLeads,
      new_buyers_within_5_minutes: newBuyers5m,
      conversion_new_buyers_within_5_min: conv5m,
      total_zalo_joined: totalZalo,
      total_paid_97k: totalPaid97k,
      conversion_zalo_per_paid_97k: convZalo,
      total_deposit_amount: depositAmount.toFixed(2),
      conversion_deposit_per_lead: convDeposit,
    };
  }
}
