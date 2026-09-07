import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  userId: number;
  username: string;
  permissions: string[];
}

/** 取当前登录用户（由 JwtStrategy 注入到 request.user） */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUser;
    return data ? user?.[data] : user;
  },
);
