import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor({ email }: { email: string }) {
    super(`${email} not found`, HttpStatus.NOT_FOUND);
  }
}
