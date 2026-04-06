import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analytics;
    constructor(analytics: AnalyticsService);
    conversionRates(from?: string, to?: string): Promise<import("./analytics.service").ConversionRatesResult>;
}
