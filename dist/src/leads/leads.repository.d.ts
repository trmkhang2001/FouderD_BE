import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class LeadsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertByPhone(data: {
        phone: string;
        name?: string | null;
        source?: string | null;
        tag?: string | null;
        status?: string | null;
        saleId?: string | null;
    }): Promise<{
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
    findManyForRole(params: {
        saleId?: string;
        skip?: number;
        take?: number;
    }): Prisma.PrismaPromise<({
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
        dealAmount: Prisma.Decimal | null;
        lastActivityAt: Date;
    })[]>;
    count(where?: Prisma.LeadWhereInput): Prisma.PrismaPromise<number>;
    findByPhone(phone: string): Prisma.Prisma__LeadClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findById(id: string): Prisma.Prisma__LeadClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteById(id: string): Prisma.Prisma__LeadClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    updateById(id: string, data: {
        name?: string | null;
        source?: string | null;
        tag?: string | null;
        status?: string | null;
        dealAmount?: number | null;
        lastActivityAt?: Date;
    }): Prisma.Prisma__LeadClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
}
