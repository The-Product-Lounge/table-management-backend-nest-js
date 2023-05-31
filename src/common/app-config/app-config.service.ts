import { Injectable } from '@nestjs/common';
import { AppConfig } from './app-config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get config(): AppConfig {
    return {
      redis: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
      },
      firebase: {
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        url: this.configService.get<string>('FIREBASE_DATABASE_URL'),
      },
      servicePort: this.configService.get<number>('PORT') ?? 3030,
      adminPassword: this.configService.get<string>('ADMIN_PASSWORD'),
    };
  }
}
