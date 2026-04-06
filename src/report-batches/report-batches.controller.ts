import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateReportBatchDto } from './dto/create-report-batch.dto';
import { ReportBatchesService } from './report-batches.service';

@ApiTags('report-batches')
@Controller('report-batches')
@UseGuards(JwtAccessGuard, RolesGuard)
export class ReportBatchesController {
  constructor(private readonly reportBatches: ReportBatchesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.SALE)
  @ApiOperation({ summary: 'List report batches (khóa/chương trình)' })
  list() {
    return this.reportBatches.list();
  }

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(CreateReportBatchDto))
  @ApiOperation({ summary: 'Create a new report batch (khóa/chương trình)' })
  @ApiResponse({ status: 201, description: 'Batch created' })
  create(@Body() body: CreateReportBatchDto) {
    return this.reportBatches.create(body);
  }
}

