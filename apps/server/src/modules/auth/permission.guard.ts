import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../../common/decorators/require-permission.decorator';
import type { JwtUser } from '../../common/decorators/current-user.decorator';

/** 权限守卫：校验当前用户是否具备接口声明的权限标识 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const user = context.switchToHttp().getRequest().user as JwtUser;
    const perms = user?.permissions ?? [];
    // 超级权限 * 放行
    if (perms.includes('*')) return true;
    const ok = required.every((p) => perms.includes(p));
    if (!ok) throw new ForbiddenException('无访问权限');
    return true;
  }
}
