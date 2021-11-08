import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService =
    app.get<AppConfigService>(AppConfigService);

  app.setGlobalPrefix(appConfig.node);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: appConfig.webDomain,
    preflightContinue: true,
    optionsSuccessStatus: 200,
  });

  await app.listen(appConfig.port);

  Logger.log(`Server running on ${appConfig.port} port`, 'Bootstrap');
}
bootstrap();
