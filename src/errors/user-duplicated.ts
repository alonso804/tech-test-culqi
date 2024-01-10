import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDuplicatedException extends HttpException {
  constructor({ email }: { email: string }) {
    super(`${email} already exists`, HttpStatus.BAD_REQUEST);
  }
}
