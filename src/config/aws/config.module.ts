import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { AWSConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().default('ap-northeast-2'),
      }),
    }),
  ],
  providers: [ConfigService, AWSConfigService],
  exports: [ConfigService, AWSConfigService],
})
export class AWSConfigModule {}
