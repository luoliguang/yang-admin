import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { buildMenuTree } from '../menus/menu.util';
import type { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private signTokens(sub: number, username: string) {
    const accessToken = this.jwt.sign(
      { sub, username },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '2h'),
      },
    );
    const refreshToken = this.jwt.sign(
      { sub, username },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );
    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    if (user.status !== 1) throw new UnauthorizedException('账号已被禁用');
    return this.signTokens(user.id, user.username);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      return this.signTokens(payload.sub, payload.username);
    } catch {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  /** 当前用户资料：基本信息 + 权限标识 + 菜单路由树 */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { menus: true } } },
    });
    if (!user) throw new UnauthorizedException('用户不存在');

    const allMenus = user.roles.flatMap((r) => r.menus);
    // 去重
    const menuMap = new Map(allMenus.map((m) => [m.id, m]));
    const menus = [...menuMap.values()];

    const permissions = [
      ...new Set(menus.map((m) => m.permission).filter((p): p is string => !!p)),
    ];
    const roles = user.roles.map((r) => r.code);
    // 目录/菜单（排除按钮 type=2）构成前端路由树
    const routes = buildMenuTree(menus.filter((m) => m.type !== 2));

    return {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
      },
      roles,
      permissions,
      routes,
    };
  }
}
