import { BadRequestException, Injectable } from '@nestjs/common';
import { LeadPipelineStage, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';

const STAGE_KEYS: LeadPipelineStage[] = [
  'NEW',
  'CONTACTED',
  'PERSUADING',
  'PAYMENT_SUCCESS',
  'ZALO_JOINED',
  'REFUND',
];

export type StageCounts = {
  NEW: number;
  CONTACTED: number;
  PERSUADING: number;
  PAYMENT_SUCCESS: number;
  ZALO_JOINED: number;
  REFUND: number;
};

export type SaleStageRatios = {
  NEW: number;
  CONTACTED: number;
  PERSUADING: number;
  PAYMENT_SUCCESS: number;
  ZALO_JOINED: number;
  REFUND: number;
};

export type SaleMetricsRow = {
  saleId: string;
  saleName: string | null;
  saleEmail: string;
  totalLeads: number;
  counts: StageCounts;
  ratios: SaleStageRatios;
  dataNew: number;
  dataApproach: number;
  dataPersuade: number;
  dataPayment: number;
};

export type SalesAnalyticsOverviewResult = {
  range: { from: string; to: string };
  sales: SaleMetricsRow[];
};

function parseDateOrDefault(from?: string, to?: string) {
  const toDate = to ? new Date(to) : new Date();
  const fromDate = from
    ? new Date(from)
    : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new BadRequestException('Invalid from/to date');
  }
  return { fromDate, toDate };
}

function initStageCounts(): StageCounts {
  return {
    NEW: 0,
    CONTACTED: 0,
    PERSUADING: 0,
    PAYMENT_SUCCESS: 0,
    ZALO_JOINED: 0,
    REFUND: 0,
  };
}

function initStageRatios(): SaleStageRatios {
  return {
    NEW: 0,
    CONTACTED: 0,
    PERSUADING: 0,
    PAYMENT_SUCCESS: 0,
    ZALO_JOINED: 0,
    REFUND: 0,
  };
}

@Injectable()
export class SalesAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(
    user: JwtUserPayload,
    opts: { from?: string; to?: string; saleId?: string },
  ): Promise<SalesAnalyticsOverviewResult> {
    const { fromDate, toDate } = parseDateOrDefault(opts.from, opts.to);

    const saleIds =
      user.role === Role.SALE
        ? [user.sub]
        : opts.saleId
          ? [opts.saleId]
          : (
              await this.prisma.user.findMany({
                where: { role: Role.SALE },
                select: { id: true },
              })
            ).map((u) => u.id);

    if (saleIds.length === 0) {
      return {
        range: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
        sales: [],
      };
    }

    const saleRows = await this.prisma.user.findMany({
      where: { id: { in: saleIds } },
      select: { id: true, name: true, email: true },
    });
    const saleMetaById = new Map(
      saleRows.map((s) => [s.id, { saleName: s.name, saleEmail: s.email }]),
    );

    const grouped = await this.prisma.lead.groupBy({
      by: ['saleId', 'pipelineStage'],
      where: {
        saleId: { in: saleIds },
        createdAt: { gte: fromDate, lte: toDate },
      },
      _count: { _all: true },
    });

    const countBySale = new Map<string, StageCounts>();
    for (const saleId of saleIds) {
      countBySale.set(saleId, initStageCounts());
    }

    for (const row of grouped) {
      const saleId = row.saleId;
      if (!saleId) continue;
      const stage = row.pipelineStage;
      const next = countBySale.get(saleId);
      if (!next) continue;
      if (stage in next) {
        next[stage as keyof StageCounts] += row._count._all;
      }
    }

    const sales: SaleMetricsRow[] = saleIds
      .map((saleId) => {
        const counts = countBySale.get(saleId) ?? initStageCounts();
        const totalLeads = Object.values(counts).reduce((acc, v) => acc + v, 0);

        const ratios = initStageRatios();
        if (totalLeads > 0) {
          for (const k of STAGE_KEYS) {
            ratios[k] = counts[k] / totalLeads;
          }
        }

        const dataNew = counts.NEW;
        const dataApproach = counts.CONTACTED;
        const dataPersuade = counts.PERSUADING;
        const dataPayment = counts.PAYMENT_SUCCESS + counts.ZALO_JOINED;

        const meta = saleMetaById.get(saleId);
        if (!meta) return null;

        return {
          saleId,
          saleName: meta.saleName,
          saleEmail: meta.saleEmail,
          totalLeads,
          counts,
          ratios,
          dataNew,
          dataApproach,
          dataPersuade,
          dataPayment,
        };
      })
      .filter(Boolean) as SaleMetricsRow[];

    sales.sort((a, b) => b.totalLeads - a.totalLeads);

    return {
      range: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
      sales,
    };
  }
}
