import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  readonly #logger = new Logger();

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.#logger.log('Hello World!');

    return this.appService.getHello();
  }
}
