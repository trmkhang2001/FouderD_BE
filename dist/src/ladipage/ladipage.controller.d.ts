import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { LadipageService } from './ladipage.service';
export declare class LadipageController {
    private readonly ladipage;
    constructor(ladipage: LadipageService);
    pipeline(user: JwtUserPayload, date?: string, saleId?: string, batchId?: string, latest?: string): Promise<{
        date: string;
        sales: {
            saleId: string;
            saleName: string | null;
            saleEmail: string;
            stages: {
                key: string;
                label: string;
                count: number;
                amount?: string | null;
                ratio: number | null;
            }[];
            total: number;
            updatedAt: string | null;
        }[];
        batchMarketingCosts: {
            updatedAt: string | null;
            znsCost: number | null;
            callCost: number | null;
            emailCost: number | null;
            totalCost: number | null;
        } | null;
    }>;
}
