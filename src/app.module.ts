import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { DailyReportsModule } from './daily-reports/daily-reports.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { ReconciliationModule } from './reconciliation/reconciliation.module';
import { LadipageModule } from './ladipage/ladipage.module';
import { ReportBatchesModule } from './report-batches/report-batches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LeadsModule,
    TransactionsModule,
    WebhooksModule,
    DailyReportsModule,
    AnalyticsModule,
    PipelineModule,
    ReconciliationModule,
    LadipageModule,
    ReportBatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
