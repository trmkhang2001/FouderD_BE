import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('analytics')
@ApiTags('analytics')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('conversion-rates')
  conversionRates(@Query('from') from?: string, @Query('to') to?: string) {
    const toDate = to ? new Date(to) : new Date();
    const fromDate = from
      ? new Date(from)
      : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    return this.analytics.conversionRates(fromDate, toDate);
  }
}
