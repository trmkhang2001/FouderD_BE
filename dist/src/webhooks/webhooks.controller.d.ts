import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooks;
    constructor(webhooks: WebhooksService);
    ladiwork(secret: string | undefined, body: unknown): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        source: string | null;
        tag: string | null;
        status: string | null;
        saleId: string | null;
        pipelineStage: import("@prisma/client").$Enums.LeadPipelineStage;
        dealAmount: import("@prisma/client-runtime-utils").Decimal | null;
        lastActivityAt: Date;
    }>;
    sepay(secret: string | undefined, body: unknown): Promise<{
        id: string;
        createdAt: Date;
        transactionId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        content: string | null;
        transactionDate: Date;
        phoneSender: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        isVerified: boolean;
        leadId: string | null;
    }>;
    ladipage(secret: string | undefined, body: unknown): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        saleId: string;
        date: Date;
        payload: import("@prisma/client/runtime/client").JsonValue;
    }>;
    marketingCosts(secret: string | undefined, body: unknown): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        batchId: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
