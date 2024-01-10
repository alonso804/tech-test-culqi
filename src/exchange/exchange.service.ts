import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { CurrencyNotFoundException } from 'src/errors/currency-not-found';
import { ExchangeDuplicatedException } from 'src/errors/exchange-duplicated';
import { Repository } from 'typeorm';

import type { CalculateExchangeDto } from './dto/calculate-exchange.dto';
import type { CreateExchangeDto } from './dto/create-exchange.dto';
import type { UpdateExchangeDto } from './dto/update-exchange.dto';
import { Exchange } from './entities/exchange.entity';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);

  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
  ) {}

  async create(createExchangeDto: CreateExchangeDto) {
    try {
      const newExchange = await this.exchangeRepository.save(createExchangeDto);

      return newExchange;
    } catch (error) {
      this.logger.error(error);

      throw new ExchangeDuplicatedException({
        currency: createExchangeDto.currency,
      });
    }
  }

  async findAll() {
    return this.exchangeRepository.find();
  }

  async findOne(currency: string) {
    const exchange = await this.exchangeRepository.findOneBy({ currency });

    return exchange;
  }

  async update(currency: string, updateExchangeDto: UpdateExchangeDto) {
    return this.exchangeRepository.update({ currency }, updateExchangeDto);
  }

  async getExchange({
    amount,
    sourceCurrency,
    targetCurrency,
  }: CalculateExchangeDto) {
    const [sourceExchange, targetExchange] = await Promise.all([
      this.exchangeRepository.findOneBy({ currency: sourceCurrency }),
      this.exchangeRepository.findOneBy({ currency: targetCurrency }),
    ]);

    this.logger.log({ sourceExchange, targetExchange });

    if (!sourceExchange) {
      throw new CurrencyNotFoundException({ currency: sourceCurrency });
    }

    if (!targetExchange) {
      throw new CurrencyNotFoundException({ currency: targetCurrency });
    }

    const amounts = {
      amount: new Decimal(amount).div(100),
      source: new Decimal(sourceExchange.amount).div(100),
      target: new Decimal(targetExchange.amount).div(100),
    };

    const exchange = amounts.amount
      .mul(amounts.target)
      .div(amounts.source)
      .toNumber();

    return {
      exchange,
      amount: amounts.amount.toNumber(),
      currency: {
        source: sourceCurrency,
        target: targetCurrency,
      },
      exchangeRate: amounts.target.div(amounts.source).toNumber(),
    };
  }
}
