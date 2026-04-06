import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DailyReportsService } from './daily-reports.service';
import { UpsertDailyReportDto } from './dto/upsert-daily-report.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('daily-reports')
@ApiTags('daily-reports')
@UseGuards(JwtAccessGuard, RolesGuard)
export class DailyReportsController {
  constructor(private readonly dailyReports: DailyReportsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SALE)
  @UsePipes(new ZodValidationPipe(UpsertDailyReportDto))
  submit(
    @CurrentUser() user: JwtUserPayload,
    @Body() body: UpsertDailyReportDto,
  ) {
    return this.dailyReports.submit(user, body);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.SALE)
  list(
    @CurrentUser() user: JwtUserPayload,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dailyReports.list(user, { from, to });
  }
}
