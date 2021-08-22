import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { AppConfigService } from './config/app/config.service';
import { SentryConfigService } from './config/sentry/config.service';
import { ErrorMessagesInterceptor } from './common/interceptor/error.messages.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService =
    app.get<AppConfigService>(AppConfigService);
  const sentryConfig: SentryConfigService =
    app.get<SentryConfigService>(SentryConfigService);

  app.setGlobalPrefix(appConfig.node);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: sentryConfig.env,
  });

  app.enableCors({
    origin: appConfig.node === 'prod' ? appConfig.webDomain : '*',
  });

  app.useGlobalInterceptors(new ErrorMessagesInterceptor(appConfig));

  await app.listen(appConfig.port);

  Logger.log(`Server running on ${appConfig.port} port`, 'Bootstrap');
}
bootstrap();
