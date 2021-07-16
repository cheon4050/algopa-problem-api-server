import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProblemsModule } from './problems/problems.module';
import * as Joi from '@hapi/joi';
import { Neo4jConfig, Neo4jModule } from 'nest-neo4j';

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
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => {
        return {
          scheme: configService.get('DATABASE_SCHEME'),
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_DB'),
        };
      },
    }),
    ProblemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
