import { Prisma, ReportPeriod } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class DailyReportsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsert(data: {
        saleId: string;
        date: Date;
        period: ReportPeriod;
        totalLeadsReceived: number;
        totalContacted: number;
        totalClosed97k: number;
        totalDepositYmm: Prisma.Decimal;
        totalZaloJoined: number;
    }): Prisma.Prisma__DailyReportClient<{
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
    findManyForSale(saleId: string, from?: Date, to?: Date): Prisma.PrismaPromise<{
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
    findManyAll(from?: Date, to?: Date): Prisma.PrismaPromise<({
        sale: {
            id: string;
            email: string;
            name: string;
        };
    } & {
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
    })[]>;
    aggregateTotals(from?: Date, to?: Date): Prisma.PrismaPromise<Prisma.GetDailyReportAggregateType<{
        where: {
            date: {
                gte: Date | undefined;
                lte: Date | undefined;
            };
        };
        _sum: {
            totalLeadsReceived: true;
            totalContacted: true;
            totalClosed97k: true;
            totalZaloJoined: true;
            totalDepositYmm: true;
        };
    }>>;
}
