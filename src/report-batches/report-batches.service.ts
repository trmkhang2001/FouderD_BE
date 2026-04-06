import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function parseUtcDateOnly(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

@Injectable()
export class ReportBatchesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.reportBatch.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  create(input: {
    name: string;
    startDate: string;
    endDate: string;
  }) {
    return this.prisma.reportBatch.create({
      data: {
        name: input.name,
        startDate: parseUtcDateOnly(input.startDate),
        endDate: parseUtcDateOnly(input.endDate),
      },
    });
  }
}

