import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SentryConfigService {
  constructor(private configService: ConfigService) {}

  get dsn(): string {
    return this.configService.get<string>('sentry.dsn');
  }

  get env(): string {
    return this.configService.get<string>('sentry.env');
  }
}
