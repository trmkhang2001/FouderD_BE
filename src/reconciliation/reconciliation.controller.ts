import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ReconciliationService } from './reconciliation.service';
import { AttachTransactionDto } from './dto/attach-transaction.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin/reconciliation')
@ApiTags('reconciliation')
@UseGuards(JwtAccessGuard, RolesGuard)
export class ReconciliationController {
  constructor(private readonly reconciliation: ReconciliationService) {}

  @Get('unmatched-transactions')
  @Roles(Role.ADMIN)
  listUnmatched() {
    return this.reconciliation.listUnmatchedTransactions();
  }

  @Post('attach-transaction')
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(AttachTransactionDto))
  attach(@Body() body: AttachTransactionDto) {
    return this.reconciliation.attachTransactionToLead(body);
  }
}

