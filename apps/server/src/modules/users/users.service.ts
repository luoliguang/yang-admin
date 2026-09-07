import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import type { PageQueryDto } from '../../common/dto/page-query.dto';
import type { CreateUserDto, UpdateUserDto } from './dto/user.dto';

// 出参统一剔除密码
const userSelect = {
  id: true,
  username: true,
  nickname: true,
  email: true,
  avatar: true,
  status: true,
  createdAt: true,
  roles: { select: { id: true, name: true, code: true } },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PageQueryDto) {
    const { page, pageSize, keyword } = query;
    const where = keyword
      ? { OR: [{ username: { contains: keyword } }, { nickname: { contains: keyword } }] }
      : {};
    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
        select: userSelect,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { list, total, page, pageSize };
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (exists) throw new BadRequestException('用户名已存在');
    const { password, roleIds, ...rest } = dto;
    return this.prisma.user.create({
      data: {
        ...rest,
        password: await bcrypt.hash(password, 10),
        roles: roleIds ? { connect: roleIds.map((id) => ({ id })) } : undefined,
      },
      select: userSelect,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.ensureExists(id);
    const { password, roleIds, ...rest } = dto;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        password: password ? await bcrypt.hash(password, 10) : undefined,
        roles: roleIds ? { set: roleIds.map((rid) => ({ id: rid })) } : undefined,
      },
      select: userSelect,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.user.delete({ where: { id }, select: { id: true } });
  }

  private async ensureExists(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
  }
}
