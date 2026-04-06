import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { CreateUserInput } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  list() {
    return this.users.listForAdmin();
  }

  async create(input: CreateUserInput) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const password = await bcrypt.hash(input.password, 12);
    return this.users.create({
      email: input.email,
      password,
      name: input.name,
      role: input.role as Role,
      saleAccId: input.saleAccId,
    });
  }

  async getOne(id: string) {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      saleAccId: user.saleAccId,
      createdAt: user.createdAt,
    };
  }

  async update(id: string, input: { role: Role; saleAccId?: string | null }) {
    const existing = await this.users.findById(id);
    if (!existing) {
      throw new NotFoundException();
    }

    return this.users.update(id, {
      role: input.role,
      saleAccId: input.saleAccId ?? null,
    });
  }
}
