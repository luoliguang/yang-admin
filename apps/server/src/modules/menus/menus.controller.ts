import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('tree')
  @ApiOperation({ summary: '菜单树' })
  @RequirePermission('system:menu:list')
  tree() {
    return this.menusService.tree();
  }

  @Post()
  @ApiOperation({ summary: '新增菜单' })
  @RequirePermission('system:menu:add')
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑菜单' })
  @RequirePermission('system:menu:edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @RequirePermission('system:menu:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.remove(id);
  }
}
