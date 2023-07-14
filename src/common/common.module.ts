import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config/app-config.service';
import { FirebaseModule } from './firebase/firebase.module';
import { DbModule } from './db/db.module';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
    FirebaseModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: (configService: AppConfigService) => ({
        redis: configService.config.redis,
      }),
      inject: [AppConfigService],
    }),
    AuthModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService, FirebaseModule, DbModule],
})
export class CommonModule {}
