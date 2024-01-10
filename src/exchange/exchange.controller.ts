import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CurrencyNotFoundException } from 'src/errors/currency-not-found';

import { CalculateExchangeDto } from './dto/calculate-exchange.dto';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { ExchangeService } from './exchange.service';

@ApiTags('exchange')
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

  @Get(':currency')
  async findOne(@Param('currency') currency: string) {
    const exchange = await this.exchangeService.findOne(currency);

    if (!exchange) {
      throw new CurrencyNotFoundException({ currency });
    }

    return exchange;
  }

  @Patch(':currency')
  update(
    @Param('currency') currency: string,
    @Body() updateExchangeDto: UpdateExchangeDto,
  ) {
    return this.exchangeService.update(currency, updateExchangeDto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth' })
  @Get('calculate')
  @UseGuards(JwtGuard)
  getExchange(@Query() calculateExchangeDto: CalculateExchangeDto) {
    return this.exchangeService.getExchange(calculateExchangeDto);
  }
}
