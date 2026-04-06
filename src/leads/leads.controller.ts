import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LeadsService } from './leads.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

@Controller('leads')
@ApiTags('leads')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.SALE)
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  list(
    @CurrentUser() user: JwtUserPayload,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('saleId') saleId?: string,
  ) {
    return this.leads.list(user, {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      saleId: saleId ?? undefined,
    });
  }

  @Get(':id')
  getOne(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.leads.getOne(user, id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SALE)
  deleteOne(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.leads.delete(user, id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SALE)
  updateOne(
    @CurrentUser() user: JwtUserPayload,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLeadDto)) body: UpdateLeadDto,
  ) {
    return this.leads.update(user, id, body);
  }
}
