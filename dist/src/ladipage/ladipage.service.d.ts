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
export declare class LadipageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    pipeline(opts: {
        user: JwtUserPayload;
        date?: string;
        saleId?: string;
        batchId?: string;
        latest?: string;
    }): Promise<{
        date: string;
        sales: SaleStages[];
        batchMarketingCosts: {
            updatedAt: string | null;
            znsCost: number | null;
            callCost: number | null;
            emailCost: number | null;
            totalCost: number | null;
        } | null;
    }>;
}
export {};
