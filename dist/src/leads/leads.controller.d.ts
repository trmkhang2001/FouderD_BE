import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { LeadsService } from './leads.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsController {
    private readonly leads;
    constructor(leads: LeadsService);
    list(user: JwtUserPayload, skip?: string, take?: string, saleId?: string): import("@prisma/client").Prisma.PrismaPromise<({
        sale: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
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
    })[]>;
    getOne(user: JwtUserPayload, id: string): Promise<{
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
    deleteOne(user: JwtUserPayload, id: string): Promise<{
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
    updateOne(user: JwtUserPayload, id: string, body: UpdateLeadDto): Promise<{
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
}
