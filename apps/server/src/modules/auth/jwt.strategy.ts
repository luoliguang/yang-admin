import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtUser } from '../../common/decorators/current-user.decorator';

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'dev-secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: { include: { menus: true } } },
    });
    if (!user || user.status !== 1) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }
    // 汇总权限标识（去重、过滤空值）
    const permissions = [
      ...new Set(
        user.roles
          .flatMap((r) => r.menus)
          .map((m) => m.permission)
          .filter((p): p is string => !!p),
      ),
    ];
    return { userId: user.id, username: user.username, permissions };
  }
}
