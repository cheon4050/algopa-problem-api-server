import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserRequest } from 'src/services/problems/interfaces/request/user-request.interface';

export const User = createParamDecorator(
  (isEssential: boolean, ctx: ExecutionContext): IUserRequest | null => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.email && request.query.provider) {
      return {
        email: request.query?.email,
        provider: request.query?.provider,
      };
    } else {
      return;
    }
  },
);
