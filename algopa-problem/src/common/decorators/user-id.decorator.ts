import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (isEssential: boolean, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    if (request.headers['id']) {
      return parseInt(request.headers['id']);
    } else {
      if (isEssential) {
        throw new UnauthorizedException('UNAUTHORIZED_USER');
      } else {
        return null;
      }
    }
  },
);
