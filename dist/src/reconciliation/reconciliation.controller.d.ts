import { ReconciliationService } from './reconciliation.service';
import { AttachTransactionDto } from './dto/attach-transaction.dto';
export declare class ReconciliationController {
    private readonly reconciliation;
    constructor(reconciliation: ReconciliationService);
    listUnmatched(): Promise<{
        id: string;
        transactionId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        content: string | null;
        transactionDate: Date;
        phoneSender: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        isVerified: boolean;
    }[]>;
    attach(body: AttachTransactionDto): Promise<{
        ok: boolean;
    }>;
}
