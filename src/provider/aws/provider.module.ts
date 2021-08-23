import { Module } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AWSConfigModule } from 'src/config/aws/config.module';
import { AWSConfigService } from 'src/config/aws/config.service';

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [AWSConfigModule],
        inject: [AWSConfigService],
        useFactory: (awsConfigService: AWSConfigService) => ({
          region: awsConfigService.region,
          credentials: {
            accessKeyId: awsConfigService.accessKey,
            secretAccessKey: awsConfigService.secretKey,
          },
        }),
      },
      services: [Lambda],
    }),
  ],
  providers: [],
  exports: [],
})
export class AWSProviderModule {}
