import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, ReportPeriod, Role } from '@prisma/client';
import { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { DailyReportsRepository } from './daily-reports.repository';
import { UpsertDailyReportSchema } from './dto/upsert-daily-report.dto';

function parseUtcDateOnly(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

@Injectable()
export class DailyReportsService {
  constructor(private readonly reports: DailyReportsRepository) {}

  submit(user: JwtUserPayload, raw: unknown) {
    const body = UpsertDailyReportSchema.parse(raw);
    let saleId = user.sub;
    if (body.sale_id) {
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenException('Only ADMIN can set sale_id');
      }
      saleId = body.sale_id;
    } else if (user.role === Role.MANAGER) {
      throw new ForbiddenException(
        'MANAGER must not create reports via this endpoint',
      );
    }
    const date = parseUtcDateOnly(body.date);
    const period = body.period as ReportPeriod;
    const totalDepositYmm =
      typeof body.total_deposit_ymm === 'string'
        ? new Prisma.Decimal(body.total_deposit_ymm)
        : new Prisma.Decimal(body.total_deposit_ymm);
    return this.reports.upsert({
      saleId,
      date,
      period,
      totalLeadsReceived: body.total_leads_received,
      totalContacted: body.total_contacted,
      totalClosed97k: body.total_closed_97k,
      totalDepositYmm,
      totalZaloJoined: body.total_zalo_joined,
    });
  }

  list(user: JwtUserPayload, query: { from?: string; to?: string }) {
    const from = query.from ? parseUtcDateOnly(query.from) : undefined;
    const to = query.to ? parseUtcDateOnly(query.to) : undefined;
    if (user.role === Role.SALE) {
      return this.reports.findManyForSale(user.sub, from, to);
    }
    return this.reports.findManyAll(from, to);
  }
}
