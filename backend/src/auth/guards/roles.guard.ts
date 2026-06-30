import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const firebaseUser = request.user;
    if (!firebaseUser) return false;

    const user = await this.usersService.findByFirebaseUid(firebaseUser.uid);
    if (!user) return false;

    return requiredRoles.some((role) => user.role === role);
  }
}
