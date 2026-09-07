import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty() @IsString() @IsNotEmpty() username!: string;
  @ApiProperty() @IsString() @MinLength(5) password!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nickname?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() avatar?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() status?: number;
  @ApiPropertyOptional({ type: [Number], description: '角色 ID 列表' })
  @IsOptional()
  @IsArray()
  roleIds?: number[];
}

// 更新时密码可选（不传则不改）
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['username'] as const)) {}
