import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  app.enableCors(corsOptions);
  await app.listen(3030);
}
bootstrap();
