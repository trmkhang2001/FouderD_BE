import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtUserPayload } from '../auth/types/jwt-user.payload';
import { LeadsRepository } from './leads.repository';
import type { UpdateLeadInput } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly leads: LeadsRepository) {}

  list(
    user: JwtUserPayload,
    query: { skip?: number; take?: number; saleId?: string },
  ) {
    if (user.role === Role.SALE) {
      return this.leads.findManyForRole({
        saleId: user.sub,
        skip: query.skip,
        take: query.take ?? 50,
      });
    }
    return this.leads.findManyForRole({
      saleId: query.saleId,
      skip: query.skip,
      take: query.take ?? 50,
    });
  }

  async getOne(user: JwtUserPayload, id: string) {
    const lead = await this.leads.findById(id);
    if (!lead) {
      throw new NotFoundException();
    }
    if (user.role === Role.SALE && lead.saleId !== user.sub) {
      throw new ForbiddenException();
    }
    return lead;
  }

  async delete(user: JwtUserPayload, id: string) {
    const lead = await this.leads.findById(id);
    if (!lead) {
      throw new NotFoundException();
    }
    if (user.role === Role.SALE && lead.saleId !== user.sub) {
      throw new ForbiddenException('You can only delete your own leads');
    }
    return this.leads.deleteById(id);
  }

  async update(user: JwtUserPayload, id: string, input: UpdateLeadInput) {
    const lead = await this.leads.findById(id);
    if (!lead) {
      throw new NotFoundException();
    }
    if (user.role === Role.SALE && lead.saleId !== user.sub) {
      throw new ForbiddenException('You can only edit your own leads');
    }

    return this.leads.updateById(id, {
      name: input.name,
      source: input.source,
      tag: input.tag,
      status: input.status,
      dealAmount: input.dealAmount,
      lastActivityAt: new Date(),
    });
  }
}
