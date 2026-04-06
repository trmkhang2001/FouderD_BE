import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { SalesAnalyticsService } from './sales-analytics.service';
export declare class SalesAnalyticsController {
    private readonly salesAnalytics;
    constructor(salesAnalytics: SalesAnalyticsService);
    overview(user: JwtUserPayload, from?: string, to?: string, saleId?: string): Promise<import("./sales-analytics.service").SalesAnalyticsOverviewResult>;
}
