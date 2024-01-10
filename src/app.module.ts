import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { FastifyRequest } from 'fastify';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import env from './env';
import { ExchangeModule } from './exchange/exchange.module';
import {
  REQUEST_ID_HEADER,
  RequestIdMiddleware,
} from './request-id/request-id.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
              },
        customProps: (req: FastifyRequest['raw']) => ({
          requestId: req.headers[REQUEST_ID_HEADER],
        }),
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        autoLoadEntities: true,
        // synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    ExchangeModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
