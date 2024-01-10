import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (
      !request.headers.authorization ||
      typeof request.headers.authorization !== 'string'
    ) {
      throw new UnauthorizedException('No token provided');
    }

    const [bearer, token] = request.headers.authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      this.logger.log(
        `Is not bearer or token is empty: ${request.headers.authorization}`,
      );

      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = payload;
    } catch (err) {
      this.logger.error('Invalid token');

      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
