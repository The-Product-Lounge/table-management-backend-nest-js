import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    if (
      username === this.appConfigService.config?.adminEmail &&
      pass === this.appConfigService.config?.adminPassword
    ) {
      return { userId: 1, username: username };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
