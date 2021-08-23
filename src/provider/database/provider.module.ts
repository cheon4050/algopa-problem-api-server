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
          scheme: configService.get('NEO4J_SCHEME'),
          host: configService.get('NEO4J_HOST'),
          port: configService.get('NEO4J_PORT'),
          username: configService.get('NEO4J_USERNAME'),
          password: configService.get('NEO4J_PASSWORD'),
          database: configService.get('NEO4J_DATABASE'),
        };
      },
    }),
  ],
})
export class Neo4jDatabaseProviderModule {}
