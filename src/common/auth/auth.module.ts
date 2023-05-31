import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (appConfig: AppConfigService) => ({
        secret: appConfig.config.jwtSecret,
        signOptions: { expiresIn: '60s' },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
