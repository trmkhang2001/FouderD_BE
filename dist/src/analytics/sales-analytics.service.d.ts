import { PrismaService } from '../prisma/prisma.service';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
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
    range: {
        from: string;
        to: string;
    };
    sales: SaleMetricsRow[];
};
export declare class SalesAnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    overview(user: JwtUserPayload, opts: {
        from?: string;
        to?: string;
        saleId?: string;
    }): Promise<SalesAnalyticsOverviewResult>;
}
