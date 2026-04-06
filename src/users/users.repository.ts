import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findBySaleAccId(saleAccId: string) {
    return this.prisma.user.findFirst({ where: { saleAccId } });
  }

  listForAdmin() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        saleAccId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
    saleAccId?: string | null;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        saleAccId: data.saleAccId ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        saleAccId: true,
        createdAt: true,
      },
    });
  }

  update(
    id: string,
    data: {
      role: Role;
      email: string;
      name: string;
      saleAccId: string | null;
      password?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data: {
        role: data.role,
        email: data.email,
        name: data.name,
        saleAccId: data.saleAccId,
        ...(data.password
          ? {
              password: data.password,
              tokenVersion: { increment: 1 },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        saleAccId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  incrementTokenVersion(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
  }
}
