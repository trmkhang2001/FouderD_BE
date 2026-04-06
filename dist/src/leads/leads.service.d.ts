import { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { LeadsRepository } from './leads.repository';
import type { UpdateLeadInput } from './dto/update-lead.dto';
export declare class LeadsService {
    private readonly leads;
    constructor(leads: LeadsRepository);
    list(user: JwtUserPayload, query: {
        skip?: number;
        take?: number;
        saleId?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
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
    delete(user: JwtUserPayload, id: string): Promise<{
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
    update(user: JwtUserPayload, id: string, input: UpdateLeadInput): Promise<{
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
