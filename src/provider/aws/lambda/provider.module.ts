import { Module } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AWSProviderModule } from '../provider.module';

@Module({
  imports: [AWSProviderModule, AwsSdkModule.forFeatures([Lambda])],
  providers: [],
  exports: [],
})
export class LambdaProviderModule {}
