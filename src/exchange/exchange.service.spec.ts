import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrencyNotFoundException } from 'src/errors/currency-not-found';
import { ExchangeDuplicatedException } from 'src/errors/exchange-duplicated';
import { Repository } from 'typeorm';

import { Exchange } from './entities/exchange.entity';
import { ExchangeService } from './exchange.service';

jest.mock('./entities/exchange.entity');

describe('ExchangeService', () => {
  let service: ExchangeService;
  let exchangeRepository: Repository<Exchange>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: getRepositoryToken(Exchange),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    exchangeRepository = module.get<Repository<Exchange>>(
      getRepositoryToken(Exchange),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an exchange if currency does not exists', async () => {
      const createExchangeDto = {
        amount: 1,
        currency: 'PEN',
      };

      const expectedResult = {
        id: 'uuid',
        amount: 100,
        currency: 'PEN',
      };

      jest.spyOn(exchangeRepository, 'save').mockResolvedValue(expectedResult);

      const result = await service.create(createExchangeDto);

      expect(result).toEqual(expectedResult);
      expect(exchangeRepository.save).toHaveBeenCalledWith(createExchangeDto);
    });

    it('should not create an exchange if currency exists', async () => {
      jest.spyOn(exchangeRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(() =>
        service.create({
          amount: 1,
          currency: 'SOME-CURRENCY',
        }),
      ).rejects.toThrowError(ExchangeDuplicatedException);
    });
  });

  describe('findAll', () => {
    it('should find all exchanges', async () => {
      const expectedResult = [
        {
          id: 'uuid',
          amount: 100,
          currency: 'PEN',
        },
      ];

      jest.spyOn(exchangeRepository, 'find').mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(exchangeRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one exchange if currency exists', async () => {
      const expectedResult = {
        id: 'uuid',
        amount: 100,
        currency: 'PEN',
      };

      jest
        .spyOn(exchangeRepository, 'findOneBy')
        .mockResolvedValueOnce(expectedResult);

      const result = await service.findOne('PEN');

      expect(result).toEqual(expectedResult);
      expect(exchangeRepository.findOneBy).toHaveBeenCalled();
    });

    it('should return null if currency does not exists', async () => {
      jest.spyOn(exchangeRepository, 'findOneBy').mockResolvedValueOnce(null);

      const result = await service.findOne('SOME-CURRENCY');

      expect(result).toBeNull();
      expect(exchangeRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('getExchange', () => {
    it('should calculate the exchange', async () => {
      const calculateExchangeDto = {
        amount: 200,
        sourceCurrency: 'PEN',
        targetCurrency: 'USD',
      };
      const sourceExchange = {
        id: 'uuid-1',
        amount: 100,
        currency: 'PEN',
      };
      const targetExchange = {
        id: 'uuid-2',
        amount: 379,
        currency: 'USD',
      };
      const expectedResult = {
        exchange: 7.58,
        amount: 2,
        currency: {
          source: 'PEN',
          target: 'USD',
        },
        exchangeRate: 3.79,
      };

      jest
        .spyOn(exchangeRepository, 'findOneBy')
        .mockResolvedValueOnce(sourceExchange)
        .mockResolvedValueOnce(targetExchange);

      const result = await service.getExchange(calculateExchangeDto);

      expect(result).toEqual(expectedResult);
      expect(exchangeRepository.findOneBy).toHaveBeenCalledWith({
        currency: calculateExchangeDto.sourceCurrency,
      });
      expect(exchangeRepository.findOneBy).toHaveBeenCalledWith({
        currency: calculateExchangeDto.targetCurrency,
      });
    });

    it('should throw CurrencyNotFoundException if source currency is not found', async () => {
      jest.spyOn(exchangeRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(exchangeRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(() =>
        service.getExchange({
          amount: 200,
          sourceCurrency: 'PEN',
          targetCurrency: 'SOME-CURRENCY',
        }),
      ).rejects.toThrowError(CurrencyNotFoundException);
    });
  });
});
