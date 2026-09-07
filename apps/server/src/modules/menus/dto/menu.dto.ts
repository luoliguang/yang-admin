import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() parentId?: number;
  @ApiProperty({ description: '0 目录 1 菜单 2 按钮' }) @IsInt() type!: number;
  @ApiProperty() @IsString() @IsNotEmpty() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() path?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() component?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() permission?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sort?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() visible?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() status?: number;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
