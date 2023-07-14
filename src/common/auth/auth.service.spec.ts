import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfig } from '../app-config/app-config';
import { ConfigService } from '@nestjs/config';

const mockAppConfigService: AppConfig = {
  adminEmail: '',
  adminPassword: '',
  redis: {
    host: '',
    password: '',
    port: 0,
  },
  firebase: {
    clientEmail: '',
    privateKey: '',
    projectId: '',
    url: '',
  },
  servicePort: 0,
  jwtSecret: '',
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    appConfigService = module.get<AppConfigService>(AppConfigService);
  });

  describe('validateUser', () => {
    it('should return user object if username and password are correct', async () => {
      const username = 'admin@example.com';
      const password = 'password123';
      jest.spyOn(appConfigService, 'config', 'get').mockReturnValue({
        ...mockAppConfigService,
        adminEmail: username,
        adminPassword: password,
      });

      const result = await authService.validateUser(username, password);

      expect(result).toEqual({ userId: 1, username });
    });

    it('should return null if username or password is incorrect', async () => {
      const username = 'admin@example.com';
      const password = 'password123';
      jest.spyOn(appConfigService, 'config', 'get').mockReturnValue({
        ...mockAppConfigService,
        adminEmail: username,
        adminPassword: password,
      });

      const result1 = await authService.validateUser(username, 'wrongpassword');
      const result2 = await authService.validateUser('wrongusername', password);

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token if password is correct', async () => {
      const user = { userId: 1, username: 'test' };
      jest.spyOn(appConfigService, 'config', 'get').mockReturnValue({
        ...mockAppConfigService,
        jwtSecret: 'secret',
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');

      const result = await authService.login(user);

      expect(result).toEqual({ access_token: 'access_token' });
    });
  });
});
