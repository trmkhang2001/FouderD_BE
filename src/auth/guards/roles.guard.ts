import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { JwtUserPayload } from '../types/jwt-user.payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<{ user: JwtUserPayload }>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException();
    }
    const ok = required.includes(user.role);
    if (!ok) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
