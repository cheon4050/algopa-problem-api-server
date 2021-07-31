import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get node(): string {
    return this.configService.get<string>('app.node');
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get prettyLogPrint(): boolean {
    return this.configService.get<string>('app.prettyLogPrint') === 'true';
  }
}
