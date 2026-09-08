import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@ApiTags('公告管理')
@ApiBearerAuth()
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @ApiOperation({ summary: '公告分页列表' })
  @RequirePermission('system:notice:list')
  findAll(@Query() query: PageQueryDto) {
    return this.noticeService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增公告' })
  @RequirePermission('system:notice:add')
  create(@Body() dto: CreateNoticeDto) {
    return this.noticeService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑公告' })
  @RequirePermission('system:notice:edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoticeDto) {
    return this.noticeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除公告' })
  @RequirePermission('system:notice:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.remove(id);
  }
}
