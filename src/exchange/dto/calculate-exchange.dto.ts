import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsUppercase,
} from 'class-validator';

export class CalculateExchangeDto {
  @Transform((value) => Number(value))
  @IsNumber()
  @IsPositive()
  @Transform((value) => value * 100)
  @IsInt({ message: 'Amount must have 2 decimal places' })
  amount: number;

  @Transform((value) => value.toUpperCase())
  @IsString()
  @IsUppercase()
  sourceCurrency: string;

  @Transform((value) => value.toUpperCase())
  @IsString()
  @IsUppercase()
  targetCurrency: string;
}
