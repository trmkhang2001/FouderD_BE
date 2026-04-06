import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post('ladiwork')
  @ApiOperation({ summary: 'Webhook: sync leads from Ladiwork' })
  ladiwork(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() body: unknown,
  ) {
    return this.webhooks.syncLadiwork(secret, body);
  }

  @Post('sepay')
  @ApiOperation({ summary: 'Webhook: log verified transactions from Sepay' })
  sepay(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() body: unknown,
  ) {
    return this.webhooks.logSepay(secret, body);
  }

  @Post('ladipage')
  @ApiOperation({ summary: 'Webhook: upsert Ladipage snapshot into DB' })
  ladipage(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() body: unknown,
  ) {
    return this.webhooks.syncLadipageSnapshot(secret, body);
  }

  @Post('marketing-costs')
  @ApiOperation({
    summary:
      'Webhook: upsert marketing costs (ZNS/Call/Email) for a report batch',
  })
  marketingCosts(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() body: unknown,
  ) {
    return this.webhooks.syncMarketingCosts(secret, body);
  }
}
