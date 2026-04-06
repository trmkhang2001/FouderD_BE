import { PrismaService } from '../prisma/prisma.service';
export type ConversionRatesResult = {
    range: {
        from: string;
        to: string;
    };
    total_leads: number;
    new_buyers_within_5_minutes: number;
    conversion_new_buyers_within_5_min: number | null;
    total_zalo_joined: number;
    total_paid_97k: number;
    conversion_zalo_per_paid_97k: number | null;
    total_deposit_amount: string;
    conversion_deposit_per_lead: number | null;
};
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    conversionRates(from: Date, to: Date): Promise<ConversionRatesResult>;
}
