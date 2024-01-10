import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(8)
  @MaxLength(16)
  @IsString()
  @IsOptional()
  password?: string;
}
