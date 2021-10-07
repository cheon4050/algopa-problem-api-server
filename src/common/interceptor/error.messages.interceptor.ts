import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from 'src/config/app/config.service';
import { ERROR_MESSAGES } from '../constant/error-message';

@Injectable()
export class ErrorMessagesInterceptor implements NestInterceptor {
  constructor(private readonly appConfigService: AppConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (
          err.response &&
          err.response.code &&
          Object.keys(ERROR_MESSAGES).includes(err.response.code)
        ) {
          if (this.appConfigService.node === 'develop') {
            err.response.message = ERROR_MESSAGES[err.response.code];
          }
          return throwError(() => err);
        }

        return throwError(() => err);
      }),
    );
  }
}
