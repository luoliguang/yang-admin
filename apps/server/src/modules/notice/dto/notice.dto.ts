import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty()
  @IsString() title!: string;
  @ApiProperty()
  @IsOptional() @IsInt() type?: number;
  @ApiProperty()
  @IsOptional() @IsString() content?: string;
  @ApiProperty()
  @IsOptional() @IsInt() status?: number;
}

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}
