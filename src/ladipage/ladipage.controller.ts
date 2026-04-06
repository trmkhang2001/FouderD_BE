import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LadipageService } from './ladipage.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ladipage')
@Controller('ladipage')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.SALE)
export class LadipageController {
  constructor(private readonly ladipage: LadipageService) {}

  @Get('pipeline')
  @ApiOperation({
    summary: 'Get conversion pipeline snapshot (latest) for sales, optionally within a batch',
  })
  pipeline(
    @CurrentUser() user: JwtUserPayload,
    @Query('date') date?: string,
    @Query('saleId') saleId?: string,
    @Query('batchId') batchId?: string,
    @Query('latest') latest?: string,
  ) {
    return this.ladipage.pipeline({ user, date, saleId, batchId, latest });
  }
}

