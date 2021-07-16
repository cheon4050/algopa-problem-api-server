import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProblemsModule } from './problems/problems.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./env/.env.dev.local', './env/.env.dev'],
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_DB: Joi.string().required(),
        DATABASE_TYPE: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    ProblemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
