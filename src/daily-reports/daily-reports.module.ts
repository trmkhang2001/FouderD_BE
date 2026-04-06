import { Module } from '@nestjs/common';
import { DailyReportsController } from './daily-reports.controller';
import { DailyReportsRepository } from './daily-reports.repository';
import { DailyReportsService } from './daily-reports.service';

@Module({
  controllers: [DailyReportsController],
  providers: [DailyReportsRepository, DailyReportsService],
  exports: [DailyReportsRepository],
})
export class DailyReportsModule {}
