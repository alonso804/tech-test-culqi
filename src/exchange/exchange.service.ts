import { Injectable } from '@nestjs/common';

import type { CreateExchangeDto } from './dto/create-exchange.dto';
import type { UpdateExchangeDto } from './dto/update-exchange.dto';

@Injectable()
export class ExchangeService {
  create(createExchangeDto: CreateExchangeDto) {
    return 'This action adds a new exchange';
  }

  findAll() {
    return `This action returns all exchange`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exchange`;
  }

  update(currency: string, updateExchangeDto: UpdateExchangeDto) {
    return `This action updates a #${currency} exchange`;
  }

  getExchange(amount: number, sourceCurrency: string, targetCurrency: string) {
  }
}
