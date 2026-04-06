import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';

type StageSummary = {
  key: string;
  label: string;
  count: number;
  amount?: string | null;
  ratio: number | null;
};

type SaleStages = {
  saleId: string;
  saleName: string | null;
  saleEmail: string;
  stages: StageSummary[];
  total: number;
  updatedAt: string | null;
};

type MarketingCostsPayload = Record<string, any>;

function parseDateOnlyMaybe(date?: string): Date | null {
  if (!date) return null;
  // Expect yyyy-mm-dd
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException('Invalid date');
  }
  return d;
}

function parseMoneyMaybe(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const n = Number.parseFloat(String(v));
  return Number.isNaN(n) ? null : n;
}

function parseMarketingCosts(payload: MarketingCostsPayload | null): {
  znsCost: number | null;
  callCost: number | null;
  emailCost: number | null;
  totalCost: number | null;
} {
  if (!payload) {
    return {
      znsCost: null,
      callCost: null,
      emailCost: null,
      totalCost: null,
    };
  }

  // Support multiple payload shapes coming from external tools.
  const root = payload?.costs ?? payload?.marketing_costs ?? payload?.data ?? payload;

  const znsCost = parseMoneyMaybe(
    root?.zns_cost ?? root?.znsCost ?? root?.zns ?? root?.ZNS,
  );
  const callCost = parseMoneyMaybe(
    root?.call_cost ?? root?.callCost ?? root?.call ?? root?.CALL,
  );
  const emailCost = parseMoneyMaybe(
    root?.email_cost ?? root?.emailCost ?? root?.email ?? root?.EMAIL,
  );

  const values = [znsCost, callCost, emailCost].filter(
    (x): x is number => x != null,
  );
  const totalCost = values.length ? values.reduce((a, b) => a + b, 0) : null;

  return { znsCost, callCost, emailCost, totalCost };
}

function normalizeStages(stagesInput: unknown): Array<Omit<StageSummary, 'ratio'>> {
  if (!stagesInput) return [];

  // Case 1: array of stage objects
  if (Array.isArray(stagesInput)) {
    return stagesInput
      .map((s: any) => {
        const key = String(s?.key ?? s?.id ?? s?.name ?? s?.label ?? '');
        if (!key) return null;
        const label = String(s?.label ?? s?.name ?? key);
        const rawCount = s?.count ?? s?.dealCount ?? s?.total ?? 0;
        const count =
          typeof rawCount === 'number'
            ? rawCount
            : Number.parseInt(String(rawCount), 10) || 0;
        const rawAmount = s?.amount ?? s?.totalAmount ?? null;
        const amount =
          rawAmount == null ? null : String(rawAmount ?? '').trim() || null;
        return { key, label, count, amount };
      })
      .filter(Boolean) as Array<Omit<StageSummary, 'ratio'>>;
  }

  // Case 2: map/object of stages
  if (typeof stagesInput === 'object') {
    const record = stagesInput as Record<string, any>;
    return Object.entries(record).map(([key, value]) => {
      const v = value ?? {};
      const label = String(v?.label ?? v?.name ?? key);
      const rawCount = typeof v === 'number' ? v : v?.count ?? v?.dealCount ?? v?.total ?? 0;
      const count =
        typeof rawCount === 'number'
          ? rawCount
          : Number.parseInt(String(rawCount), 10) || 0;
      const rawAmount = v?.amount ?? v?.totalAmount ?? null;
      const amount =
        rawAmount == null ? null : String(rawAmount ?? '').trim() || null;
      return { key, label, count, amount };
    });
  }

  return [];
}

@Injectable()
export class LadipageService {
  constructor(private readonly prisma: PrismaService) {}

  async pipeline(opts: {
    user: JwtUserPayload;
    date?: string;
    saleId?: string;
    batchId?: string;
    latest?: string;
  }) {
    const { user } = opts;
    const dateOnly = parseDateOnlyMaybe(opts.date);

    const latestRequested =
      opts.latest === undefined
        ? !opts.date // if user didn't send `date`, we assume "latest"
        : opts.latest === 'true' || opts.latest === '1';

    const batch = opts.batchId
      ? await this.prisma.reportBatch.findUnique({
          where: { id: opts.batchId },
        })
      : null;
    if (opts.batchId && !batch) {
      throw new BadRequestException('Invalid batchId');
    }

    const ladipageSource = 'LADIPAGE';

    const rangeFrom = batch?.startDate ?? dateOnly ?? null;
    const rangeTo = batch?.endDate ?? dateOnly ?? null;

    const exactDate = !latestRequested && dateOnly && !batch ? dateOnly : null;

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

    const users = await this.prisma.user.findMany({
      where: { id: { in: saleIds } },
      select: { id: true, name: true, email: true },
    });
    const userById = new Map(users.map((u) => [u.id, u]));

    const snapshotsWhereBase = {
      saleId: { in: saleIds },
      source: ladipageSource,
    } as const;

    // Fetch latest (or exact) snapshots for the chosen time window.
    const ladipageSnapshots = exactDate
      ? await this.prisma.externalPipelineSnapshot.findMany({
          where: { ...snapshotsWhereBase, date: exactDate },
          select: { saleId: true, payload: true, updatedAt: true },
        })
      : await this.prisma.externalPipelineSnapshot.findMany({
          where: {
            ...snapshotsWhereBase,
            ...(rangeFrom && rangeTo ? { date: { gte: rangeFrom, lte: rangeTo } } : {}),
          },
          orderBy: [{ date: 'desc' }, { updatedAt: 'desc' }],
          distinct: ['saleId'],
          select: { saleId: true, payload: true, updatedAt: true },
        });

    const ladipageSnapBySaleId = new Map(
      ladipageSnapshots.map((s) => [s.saleId, s]),
    );

    const marketingCosts =
      batch
        ? await this.prisma.batchMarketingCostSnapshot.findUnique({
            where: { batchId_source: { batchId: batch.id, source: 'MARKETING_COSTS' } },
          })
        : null;

    const parsedBatchMarketingCosts = marketingCosts
      ? parseMarketingCosts(marketingCosts.payload as MarketingCostsPayload)
      : null;

    const sales: SaleStages[] = saleIds.map((saleId) => {
      const meta = userById.get(saleId);
      const snap = ladipageSnapBySaleId.get(saleId);
      const rawPayload = snap?.payload as any;
      const stagesRaw = rawPayload?.stages ?? rawPayload?.data?.stages ?? null;
      const stagesNoRatio = normalizeStages(stagesRaw);

      const total = stagesNoRatio.reduce((acc, s) => acc + s.count, 0);
      const stages: StageSummary[] = stagesNoRatio.map((s) => ({
        ...s,
        ratio: total > 0 ? s.count / total : null,
      }));

      return {
        saleId,
        saleName: meta?.name ?? null,
        saleEmail: meta?.email ?? '',
        stages,
        total,
        updatedAt: snap?.updatedAt ? snap.updatedAt.toISOString() : null,
      };
    });

    const responseDate =
      rangeTo?.toISOString() ?? new Date().toISOString();

    return {
      date: responseDate,
      sales,
      batchMarketingCosts: parsedBatchMarketingCosts
        ? {
            ...parsedBatchMarketingCosts,
            updatedAt: marketingCosts?.updatedAt
              ? marketingCosts.updatedAt.toISOString()
              : null,
          }
        : null,
    };
  }
}

