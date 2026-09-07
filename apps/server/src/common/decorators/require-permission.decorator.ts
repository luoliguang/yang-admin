import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'requirePermission';
/** 声明访问该接口所需的权限标识，如 @RequirePermission('system:user:add') */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
