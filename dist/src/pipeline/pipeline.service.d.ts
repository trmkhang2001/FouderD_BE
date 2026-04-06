import { Prisma } from '@prisma/client';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import type { CreateLeadInput } from './dto/create-lead.dto';
import type { UpdateStageInput } from './dto/update-stage.dto';
export declare class PipelineService {
    private readonly prisma;
    private readonly users;
    constructor(prisma: PrismaService, users: UsersRepository);
    createManualLead(user: JwtUserPayload, input: CreateLeadInput): Promise<{
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
        dealAmount: Prisma.Decimal | null;
        lastActivityAt: Date;
    }>;
    updateLeadStage(user: JwtUserPayload, leadId: string, input: UpdateStageInput): Promise<{
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
        dealAmount: Prisma.Decimal | null;
        lastActivityAt: Date;
    }>;
}
