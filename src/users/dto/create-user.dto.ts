import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @Transform((value) => value.trim())
  @IsEmail()
  email: string;

  @Transform((value) => value.trim())
  @MinLength(8)
  @MaxLength(16)
  @IsString()
  password: string;
}
