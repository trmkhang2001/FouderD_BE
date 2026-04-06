import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { PipelineService } from './pipeline.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('pipeline')
@ApiTags('pipeline')
@UseGuards(JwtAccessGuard, RolesGuard)
export class PipelineController {
  constructor(private readonly pipeline: PipelineService) {}

  @Post('leads')
  @Roles(Role.ADMIN, Role.SALE)
  createLead(
    @CurrentUser() user: JwtUserPayload,
    @Body(new ZodValidationPipe(CreateLeadDto)) body: CreateLeadDto,
  ) {
    // Help debug payload issues in containerized env.
    // eslint-disable-next-line no-console
    console.log('[pipeline] createLead body:', body);
    return this.pipeline.createManualLead(user, body);
  }

  @Put('leads/:id/stage')
  @Roles(Role.ADMIN, Role.SALE)
  updateStage(
    @CurrentUser() user: JwtUserPayload,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateStageDto)) body: UpdateStageDto,
  ) {
    return this.pipeline.updateLeadStage(user, id, body);
  }
}

