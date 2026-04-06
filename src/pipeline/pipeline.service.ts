import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeadPipelineStage, Prisma, Role } from '@prisma/client';
import type { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import type { CreateLeadInput } from './dto/create-lead.dto';
import type { UpdateStageInput } from './dto/update-stage.dto';

@Injectable()
export class PipelineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersRepository,
  ) {}

  async createManualLead(user: JwtUserPayload, input: CreateLeadInput) {
    if (user.role !== Role.ADMIN && user.role !== Role.SALE) {
      throw new ForbiddenException('Only ADMIN or SALE can manually create leads');
    }

    let saleId: string | null = null;

    // SALE chỉ được tự tạo lead cho chính họ.
    if (user.role === Role.SALE) {
      saleId = user.sub;
      if (input.saleId && input.saleId !== user.sub) {
        throw new BadRequestException(
          'SALE can only create leads for itself',
        );
      }
    } else {
      // ADMIN có thể tạo lead cho bất kỳ SALE nào (hoặc để trống saleId).
      const saleUser = input.saleId
        ? await this.users.findById(input.saleId)
        : null;
      saleId = saleUser?.id ?? null;

      if (saleUser && saleUser.role !== Role.SALE) {
        throw new BadRequestException('saleId must belong to a SALE user');
      }
    }

    // Enforce: once a lead (phone) is assigned to a sale, it cannot be reassigned.
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({ where: { phone: input.phone } });

      const dealAmount =
        input.dealAmount != null
          ? new Prisma.Decimal(input.dealAmount)
          : null;

      if (existing) {
        if (existing.saleId && saleId && existing.saleId !== saleId) {
          throw new BadRequestException(
            'Lead phone is already assigned to another sale',
          );
        }

        const finalSaleId = existing.saleId ?? saleId;
        const stage =
          input.pipelineStage ?? existing.pipelineStage ?? LeadPipelineStage.NEW;

        return tx.lead.update({
          where: { id: existing.id },
          data: {
            name: input.name ?? existing.name ?? null,
            source: input.source ?? existing.source ?? undefined,
            tag: input.tag ?? existing.tag ?? undefined,
            status: input.status ?? existing.status ?? undefined,
            saleId: finalSaleId,
            pipelineStage: stage,
            dealAmount:
              input.dealAmount != null ? dealAmount : undefined,
            lastActivityAt: new Date(),
          },
        });
      }

      const stage = input.pipelineStage ?? LeadPipelineStage.NEW;

      return tx.lead.create({
        data: {
          phone: input.phone,
          name: input.name ?? null,
          source: input.source ?? 'Manual',
          tag: input.tag ?? null,
          status: input.status ?? null,
          saleId,
          pipelineStage: stage,
          dealAmount,
          lastActivityAt: new Date(),
        },
      });
    });
  }

  async updateLeadStage(
    user: JwtUserPayload,
    leadId: string,
    input: UpdateStageInput,
  ) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException();
    }

    if (user.role === Role.SALE && lead.saleId !== user.sub) {
      throw new ForbiddenException('You can only update your own leads');
    }

    const target = input.pipelineStage;

    // Staged updates are always atomic.
    return this.prisma.$transaction(async (tx) => {
      return tx.lead.update({
        where: { id: lead.id },
        data: {
          pipelineStage: target,
          lastActivityAt: new Date(),
        },
      });
    });
  }
}

