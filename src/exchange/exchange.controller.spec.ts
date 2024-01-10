import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CurrencyNotFoundException } from 'src/errors/currency-not-found';
import { JWT_EXPIRATION_TIME } from 'src/helpers/constants';

import type { CreateExchangeDto } from './dto/create-exchange.dto';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

jest.mock('./exchange.service');

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let exchangeService: ExchangeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: JWT_EXPIRATION_TIME },
          }),
        }),
      ],
      controllers: [ExchangeController],
      providers: [ExchangeService],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    exchangeService = module.get<ExchangeService>(ExchangeService);
  });

  describe('create', () => {
    it('should create an exchange', async () => {
      const createExchangeDto: CreateExchangeDto = {
        amount: 1,
        currency: 'PEN',
      };
      const expectedResult = {
        id: 'uuid',
        amount: 100,
        currency: 'PEN',
      };

      jest.spyOn(exchangeService, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createExchangeDto);

      expect(result).toEqual(expectedResult);
      expect(exchangeService.create).toHaveBeenCalledWith(createExchangeDto);
    });
  });

  describe('findOne', () => {
    it('should find one exchange if currency exists', async () => {
      const currency = 'USD';
      const expectedResult = {
        id: 'uuid',
        amount: 100,
        currency: 'PEN',
      };

      jest.spyOn(exchangeService, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(currency);

      expect(result).toEqual(expectedResult);
      expect(exchangeService.findOne).toHaveBeenCalledWith(currency);
    });

    it('should throw CurrencyNotFoundException if exchange is not found', async () => {
      jest.spyOn(exchangeService, 'findOne').mockResolvedValueOnce(null);

      await expect(() =>
        controller.findOne('SOME-CURRENCY'),
      ).rejects.toThrowError(CurrencyNotFoundException);
    });
  });
});
