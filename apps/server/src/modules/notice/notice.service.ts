import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { PageQueryDto } from '../../common/dto/page-query.dto';
import type { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PageQueryDto) {
    const { page, pageSize, keyword } = query;
    const where = keyword
      ? { OR: [{ title: { contains: keyword } }] }
      : {};
    const [list, total] = await Promise.all([
      this.prisma.notice.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.notice.count({ where }),
    ]);
    return { list, total, page, pageSize };
  }

  create(dto: CreateNoticeDto) {
    return this.prisma.notice.create({ data: dto });
  }

  async update(id: number, dto: UpdateNoticeDto) {
    await this.ensure(id);
    return this.prisma.notice.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensure(id);
    return this.prisma.notice.delete({ where: { id } });
  }

  private async ensure(id: number) {
    const found = await this.prisma.notice.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('公告不存在');
  }
}
