import { Prisma } from '@prisma/client';
import { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { DailyReportsRepository } from './daily-reports.repository';
export declare class DailyReportsService {
    private readonly reports;
    constructor(reports: DailyReportsRepository);
    submit(user: JwtUserPayload, raw: unknown): Prisma.Prisma__DailyReportClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        saleId: string;
        date: Date;
        period: import("@prisma/client").$Enums.ReportPeriod;
        totalLeadsReceived: number;
        totalContacted: number;
        totalClosed97k: number;
        totalDepositYmm: Prisma.Decimal;
        totalZaloJoined: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    list(user: JwtUserPayload, query: {
        from?: string;
        to?: string;
    }): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        saleId: string;
        date: Date;
        period: import("@prisma/client").$Enums.ReportPeriod;
        totalLeadsReceived: number;
        totalContacted: number;
        totalClosed97k: number;
        totalDepositYmm: Prisma.Decimal;
        totalZaloJoined: number;
    }[]>;
}
