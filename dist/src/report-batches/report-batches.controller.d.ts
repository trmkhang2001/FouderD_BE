import { CreateReportBatchDto } from './dto/create-report-batch.dto';
import { ReportBatchesService } from './report-batches.service';
export declare class ReportBatchesController {
    private readonly reportBatches;
    constructor(reportBatches: ReportBatchesService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }[]>;
    create(body: CreateReportBatchDto): import("@prisma/client").Prisma.Prisma__ReportBatchClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
