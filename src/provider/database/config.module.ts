import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jConfig, Neo4jModule } from 'nest-neo4j/dist';
import { Neo4jConfigModule } from 'src/config/database/neo4j/config.module';

@Module({
  imports: [
    Neo4jConfigModule,
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
  ],
})
export class Neo4jDatabaseProviderModule {}
