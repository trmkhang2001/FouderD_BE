import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LeadsModule } from '../leads/leads.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [UsersModule, LeadsModule, TransactionsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
