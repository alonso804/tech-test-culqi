import { HttpException, HttpStatus } from '@nestjs/common';

export class ExchangeDuplicatedException extends HttpException {
  constructor({ currency }: { currency: string }) {
    super(`${currency} already exists`, HttpStatus.BAD_REQUEST);
  }
}
