import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_EXPIRATION_TIME } from 'src/helpers/constants';

import { Exchange } from './entities/exchange.entity';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: JWT_EXPIRATION_TIME },
      }),
    }),
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
