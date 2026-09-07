import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildMenuTree } from './menu.util';
import type { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  /** 全量菜单树 */
  async tree() {
    const menus = await this.prisma.menu.findMany();
    return buildMenuTree(menus);
  }

  create(dto: CreateMenuDto) {
    return this.prisma.menu.create({ data: dto });
  }

  async update(id: number, dto: UpdateMenuDto) {
    await this.ensureExists(id);
    return this.prisma.menu.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    // 一并删除子菜单
    const children = await this.prisma.menu.findMany({ where: { parentId: id } });
    await Promise.all(children.map((c) => this.remove(c.id)));
    return this.prisma.menu.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('菜单不存在');
  }
}
