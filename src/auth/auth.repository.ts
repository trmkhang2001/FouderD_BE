import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';

/** Thin facade; auth-specific persistence can grow here. */
@Injectable()
export class AuthRepository {
  constructor(private readonly users: UsersRepository) {}

  findUserByEmail(email: string) {
    return this.users.findByEmail(email);
  }

  findUserById(id: string) {
    return this.users.findById(id);
  }

  invalidateRefreshTokens(userId: string) {
    return this.users.incrementTokenVersion(userId);
  }
}
