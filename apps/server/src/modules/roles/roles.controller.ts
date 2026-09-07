import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: '角色分页列表' })
  @RequirePermission('system:role:list')
  findAll(@Query() query: PageQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增角色' })
  @RequirePermission('system:role:add')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑角色' })
  @RequirePermission('system:role:edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @RequirePermission('system:role:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
