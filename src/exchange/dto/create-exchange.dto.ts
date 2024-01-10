import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsUppercase,
} from 'class-validator';

export class CreateExchangeDto {
  @Transform((value) => Number(value))
  @IsNumber()
  @IsPositive()
  @Transform((value) => value * 100)
  @IsInt({ message: 'Amount must have 2 decimal places' })
  amount: number;

  @Transform((value) => value.toUpperCase())
  @IsString()
  @IsUppercase()
  currency: string;
}
