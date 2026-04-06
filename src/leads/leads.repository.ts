import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByPhone(data: {
    phone: string;
    name?: string | null;
    source?: string | null;
    tag?: string | null;
    status?: string | null;
    saleId?: string | null;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({ where: { phone: data.phone } });

      if (!existing) {
        return tx.lead.create({
          data: {
            phone: data.phone,
            name: data.name ?? null,
            source: data.source ?? null,
            tag: data.tag ?? null,
            status: data.status ?? null,
            saleId: data.saleId ?? null,
          },
        });
      }

      // Enforce: once a lead phone is assigned to a sale, do not reassign it.
      const finalSaleId = existing.saleId ?? (data.saleId ?? null);

      return tx.lead.update({
        where: { id: existing.id },
        data: {
          name: data.name ?? undefined,
          source: data.source ?? undefined,
          tag: data.tag ?? undefined,
          status: data.status ?? undefined,
          saleId: finalSaleId,
        },
      });
    });
  }

  findManyForRole(params: { saleId?: string; skip?: number; take?: number }) {
    const where: Prisma.LeadWhereInput = {};
    if (params.saleId) {
      where.saleId = params.saleId;
    }
    return this.prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.take,
      include: {
        sale: { select: { id: true, name: true, email: true } },
      },
    });
  }

  count(where?: Prisma.LeadWhereInput) {
    return this.prisma.lead.count({ where });
  }

  findByPhone(phone: string) {
    return this.prisma.lead.findUnique({ where: { phone } });
  }

  findById(id: string) {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  deleteById(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }

  updateById(
    id: string,
    data: {
      name?: string | null;
      source?: string | null;
      tag?: string | null;
      status?: string | null;
      dealAmount?: number | null;
      lastActivityAt?: Date;
    },
  ) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        source: data.source ?? undefined,
        tag: data.tag ?? undefined,
        status: data.status ?? undefined,
        ...(data.dealAmount !== undefined
          ? {
              dealAmount:
                data.dealAmount == null
                  ? null
                  : new Prisma.Decimal(data.dealAmount),
            }
          : {}),
        lastActivityAt: data.lastActivityAt ?? undefined,
      },
    });
  }
}
