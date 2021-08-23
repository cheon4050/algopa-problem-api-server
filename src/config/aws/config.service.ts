import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSConfigService {
  constructor(private configService: ConfigService) {}

  get accessKey(): string {
    return this.configService.get<string>('aws.accessKey');
  }
  get secretKey(): string {
    return this.configService.get<string>('aws.secretKey');
  }
  get region(): string {
    return this.configService.get<string>('aws.region');
  }
}
