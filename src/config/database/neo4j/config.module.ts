import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { Neo4jConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DATABASE_SCHEME: Joi.string().default('neo4j+s'),
        DATABASE_HOST: Joi.string().default('7dd6dae3.databases.neo4j.io'),
        DATABASE_PORT: Joi.number().default(7687),
        DATABASE_DB: Joi.string().default('neo4j'),
        DATABASE_USER: Joi.string().default('neo4j'),
        DATABASE_PASSWORD: Joi.string().default(
          'avtU8vFsCvPS_x22TZEV4ky5kOfg0sf1hRjhZpDmNys',
        ),
      }),
    }),
  ],
  providers: [ConfigService, Neo4jConfigService],
  exports: [ConfigService, Neo4jConfigService],
})
export class Neo4jConfigModule {}
