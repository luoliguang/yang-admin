import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsString() @IsNotEmpty() code!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() remark?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() status?: number;
  @ApiPropertyOptional({ type: [Number], description: '菜单 ID 列表' })
  @IsOptional()
  @IsArray()
  menuIds?: number[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
