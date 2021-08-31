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
        NEO4J_SCHEME: Joi.string().default('neo4j+s'),
        NEO4J_HOST: Joi.string().default('3e367a10.databases.neo4j.io'),
        NEO4J_PORT: Joi.number().default(7687),
        NEO4J_DATABASE: Joi.string().default('neo4j'),
        NEO4J_USERNAME: Joi.string().default('neo4j'),
        NEO4J_PASSWORD: Joi.string().default(
          'wa79w_UQynByLtW3mMjEqOyxHVddMnqJDx-5Od34x2Q',
        ),
      }),
    }),
  ],
  providers: [ConfigService, Neo4jConfigService],
  exports: [ConfigService, Neo4jConfigService],
})
export class Neo4jConfigModule {}
