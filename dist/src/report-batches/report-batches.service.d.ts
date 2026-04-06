import { PrismaService } from '../prisma/prisma.service';
export declare class ReportBatchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }[]>;
    create(input: {
        name: string;
        startDate: string;
        endDate: string;
    }): import("@prisma/client").Prisma.Prisma__ReportBatchClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
