import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export const User = createParamDecorator(
  (isEssential: boolean, ctx: ExecutionContext): IJwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    if (request.headers.email && request.headers.provider) {
      return {
        email: request.headers.email,
        provider: request.headers.provider,
      };
    }
    return null;
  },
);
