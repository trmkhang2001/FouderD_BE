import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SalesAnalyticsController } from './sales-analytics.controller';
import { SalesAnalyticsService } from './sales-analytics.service';

@Module({
  controllers: [AnalyticsController, SalesAnalyticsController],
  providers: [AnalyticsService, SalesAnalyticsService],
})
export class AnalyticsModule {}
