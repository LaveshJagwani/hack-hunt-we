import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@hackhunt.app' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'change-this-password' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
