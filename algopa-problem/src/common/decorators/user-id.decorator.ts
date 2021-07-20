import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    if (request.headers['id']) {
      return parseInt(request.headers['id']);
    } else {
      throw new UnauthorizedException('UNAUTHORIZED_USER');
    }
  },
);
