import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username!: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @MinLength(5, { message: '密码至少 5 位' })
  password!: string;
}
