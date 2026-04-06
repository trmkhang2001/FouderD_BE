import { Module } from '@nestjs/common';
import { ReportBatchesController } from './report-batches.controller';
import { ReportBatchesService } from './report-batches.service';

@Module({
  controllers: [ReportBatchesController],
  providers: [ReportBatchesService],
})
export class ReportBatchesModule {}

