import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const REQUEST_ID_HEADER = 'X-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const requestId = randomUUID();

    req.headers[REQUEST_ID_HEADER] = requestId;

    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }
}
