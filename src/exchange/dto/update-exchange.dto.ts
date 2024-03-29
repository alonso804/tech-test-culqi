import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUppercase,
} from 'class-validator';

export class UpdateExchangeDto {
  @Transform((value) => Number(value))
  @IsNumber()
  @IsPositive()
  @Transform((value) => value * 100)
  @IsInt({ message: 'Amount must have 2 decimal places' })
  @IsOptional()
  amount?: number;

  @Transform((value) => value.toUpperCase())
  @IsString()
  @IsUppercase()
  @IsOptional()
  currency?: string;
}
