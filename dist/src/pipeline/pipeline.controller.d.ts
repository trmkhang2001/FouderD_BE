import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { PipelineService } from './pipeline.service';
export declare class PipelineController {
    private readonly pipeline;
    constructor(pipeline: PipelineService);
    createLead(user: JwtUserPayload, body: CreateLeadDto): Promise<{
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
    updateStage(user: JwtUserPayload, id: string, body: UpdateStageDto): Promise<{
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
