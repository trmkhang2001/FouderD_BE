import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SalesAnalyticsService } from './sales-analytics.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('analytics/sales')
@ApiTags('analytics/sales')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.SALE)
export class SalesAnalyticsController {
  constructor(private readonly salesAnalytics: SalesAnalyticsService) {}

  @Get('overview')
  overview(
    @CurrentUser() user: JwtUserPayload,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('saleId') saleId?: string,
  ) {
    return this.salesAnalytics.overview(user, { from, to, saleId });
  }
}

