import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  create(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.create(createExchangeDto);
  }

  @Get()
  findAll() {
    return this.exchangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('currency') currency: string,
    @Body() updateExchangeDto: UpdateExchangeDto,
  ) {
    return this.exchangeService.update(currency, updateExchangeDto);
  }

  @Get()
  getExchange(
    @Param('amount') amount: number,
    @Param('sourceCurrency') sourceCurrency: string,
    @Param('targetCurrency') targetCurrency: string,
  ) {
    return this.exchangeService.getExchange(
      amount,
      sourceCurrency,
      targetCurrency,
    );
  }
}
