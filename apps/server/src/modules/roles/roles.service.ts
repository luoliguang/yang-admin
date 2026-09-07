import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { PageQueryDto } from '../../common/dto/page-query.dto';
import type { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PageQueryDto) {
    const { page, pageSize, keyword } = query;
    const where = keyword
      ? { OR: [{ name: { contains: keyword } }, { code: { contains: keyword } }] }
      : {};
    const [list, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
        include: { menus: { select: { id: true } } },
      }),
      this.prisma.role.count({ where }),
    ]);
    return {
      list: list.map((r) => ({ ...r, menuIds: r.menus.map((m) => m.id), menus: undefined })),
      total,
      page,
      pageSize,
    };
  }

  create(dto: CreateRoleDto) {
    const { menuIds, ...data } = dto;
    return this.prisma.role.create({
      data: { ...data, menus: menuIds ? { connect: menuIds.map((id) => ({ id })) } : undefined },
    });
  }

  async update(id: number, dto: UpdateRoleDto) {
    await this.ensureExists(id);
    const { menuIds, ...data } = dto;
    return this.prisma.role.update({
      where: { id },
      data: { ...data, menus: menuIds ? { set: menuIds.map((mid) => ({ id: mid })) } : undefined },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.role.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('角色不存在');
  }
}
