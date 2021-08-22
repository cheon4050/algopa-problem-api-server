import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { SentryConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        PROBLEM_SENTRY_DSN: Joi.string().required(),
        PROBLEM_SENTRY_ENV: Joi.string().default('local'),
      }),
    }),
  ],
  providers: [ConfigService, SentryConfigService],
  exports: [ConfigService, SentryConfigService],
})
export class SentryConfigModule {}
