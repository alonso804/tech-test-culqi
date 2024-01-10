import { HttpException, HttpStatus } from '@nestjs/common';

export class CurrencyNotFoundException extends HttpException {
  constructor({ currency }: { currency: string }) {
    super(`Currency ${currency} not found`, HttpStatus.NOT_FOUND);
  }
}
