import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async login(pass: any) {
    if (pass !== this.appConfigService.config.adminPassword) {
      return null;
    }
    const payload = { sub: 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
