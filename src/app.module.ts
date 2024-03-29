import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app/config.module';
import { Neo4jDatabaseProviderModule } from './provider/database/provider.module';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigService } from './config/app/config.service';
import { ApiModule } from './module/api.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorMessagesInterceptor } from './common/interceptor/error.messages.interceptor';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    Neo4jDatabaseProviderModule,
    ApiModule,
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return {
          pinoHttp: {
            prettyPrint: appConfigService.prettyLogPrint
              ? {
                  translateTime: 'SYS:mm/dd/yyyy, h:MM:ss TT Z',
                  colorize: true,
                  levelFirst: true,
                }
              : {
                  translateTime: 'SYS:mm/dd/yyyy, h:MM:ss TT Z',
                  singleLine: true,
                },
            level: appConfigService.node === 'dev' ? 'debug' : 'info',
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorMessagesInterceptor,
    },
  ],
})
export class AppModule {}
