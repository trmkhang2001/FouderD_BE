import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { DailyReportsService } from './daily-reports.service';
import { UpsertDailyReportDto } from './dto/upsert-daily-report.dto';
export declare class DailyReportsController {
    private readonly dailyReports;
    constructor(dailyReports: DailyReportsService);
    submit(user: JwtUserPayload, body: UpsertDailyReportDto): import("@prisma/client").Prisma.Prisma__DailyReportClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        saleId: string;
        date: Date;
        period: import("@prisma/client").$Enums.ReportPeriod;
        totalLeadsReceived: number;
        totalContacted: number;
        totalClosed97k: number;
        totalDepositYmm: import("@prisma/client-runtime-utils").Decimal;
        totalZaloJoined: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(user: JwtUserPayload, from?: string, to?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        saleId: string;
        date: Date;
        period: import("@prisma/client").$Enums.ReportPeriod;
        totalLeadsReceived: number;
        totalContacted: number;
        totalClosed97k: number;
        totalDepositYmm: import("@prisma/client-runtime-utils").Decimal;
        totalZaloJoined: number;
    }[]>;
}
