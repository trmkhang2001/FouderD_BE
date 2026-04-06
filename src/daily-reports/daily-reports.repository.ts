import { Injectable } from '@nestjs/common';
import { Prisma, ReportPeriod } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(data: {
    saleId: string;
    date: Date;
    period: ReportPeriod;
    totalLeadsReceived: number;
    totalContacted: number;
    totalClosed97k: number;
    totalDepositYmm: Prisma.Decimal;
    totalZaloJoined: number;
  }) {
    return this.prisma.dailyReport.upsert({
      where: {
        saleId_date_period: {
          saleId: data.saleId,
          date: data.date,
          period: data.period,
        },
      },
      create: data,
      update: {
        totalLeadsReceived: data.totalLeadsReceived,
        totalContacted: data.totalContacted,
        totalClosed97k: data.totalClosed97k,
        totalDepositYmm: data.totalDepositYmm,
        totalZaloJoined: data.totalZaloJoined,
      },
    });
  }

  findManyForSale(saleId: string, from?: Date, to?: Date) {
    return this.prisma.dailyReport.findMany({
      where: {
        saleId,
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  findManyAll(from?: Date, to?: Date) {
    return this.prisma.dailyReport.findMany({
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { date: 'desc' },
      include: { sale: { select: { id: true, name: true, email: true } } },
    });
  }

  aggregateTotals(from?: Date, to?: Date) {
    return this.prisma.dailyReport.aggregate({
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        totalLeadsReceived: true,
        totalContacted: true,
        totalClosed97k: true,
        totalZaloJoined: true,
        totalDepositYmm: true,
      },
    });
  }
}
