import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorMessagesInterceptor } from './common/interceptors/error.messages.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ErrorMessagesInterceptor(configService));
  await app.listen(configService.get('APP_PORT'));
  Logger.log(
    `Server running on ${configService.get('APP_DOMAIN')}:${configService.get(
      'APP_PORT',
    )}`,
    'Bootstrap',
  );
}
bootstrap();
