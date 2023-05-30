import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './common/app-config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  let corsOptions;
  if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    corsOptions = {
      origin: [
        'https://theproductloundge.com',
        'https://myseat.theproductlounge.com',
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
      ],
      credentials: true,
    };
  } else {
    // Configuring CORS
    corsOptions = {
      // Make sure origin contains the url your frontend is running on
      origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
      ],
      credentials: true,
    };
  }
  const configService: AppConfigService =
    app.get<AppConfigService>(AppConfigService);
  app.enableCors(corsOptions);
  await app.listen(configService.config.servicePort);
}

bootstrap();
