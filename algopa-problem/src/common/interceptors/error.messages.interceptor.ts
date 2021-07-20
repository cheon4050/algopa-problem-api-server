import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../../messages/error.messages';

@Injectable()
export class ErrorMessagesInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (
          err.response &&
          err.response.message &&
          Object.keys(ERROR_MESSAGES).includes(err.response.message)
        ) {
          const errorResponse = {
            code: err.response.message,
            message: ERROR_MESSAGES[err.response.message],
          };

          if (this.configService.get('NODE_ENV') === 'prod') {
            delete errorResponse.message;
          }
          switch (err.status) {
            case 401:
              throw new UnauthorizedException(errorResponse);
            case 404:
              throw new NotFoundException(errorResponse);
            case 409:
              throw new ConflictException(errorResponse);
            default:
              throw new BadRequestException(errorResponse);
          }
        } else {
          return throwError(err);
        }
      }),
    );
  }
}
