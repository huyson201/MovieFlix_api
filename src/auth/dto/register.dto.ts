import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name?: string;
}
