import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '用户分页列表' })
  @RequirePermission('system:user:list')
  findAll(@Query() query: PageQueryDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增用户' })
  @RequirePermission('system:user:add')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑用户' })
  @RequirePermission('system:user:edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @RequirePermission('system:user:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
