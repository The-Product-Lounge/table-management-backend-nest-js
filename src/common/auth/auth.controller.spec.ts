import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';

const mockJwtService = {
  sign: () => 'mock-token',
};

const mockAppConfigService = {};
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: AppConfigService, useValue: mockAppConfigService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('@Controller', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', AuthController);
      expect(path).toBe('auth');
    });
  });

  describe('login', () => {
    describe('@UseGuards', () => {
      it('should use the LocalAuthGuard', () => {
        const guards = Reflect.getMetadata(
          '__guards__',
          AuthController.prototype.login,
        );
        expect(guards).toEqual(expect.arrayContaining([LocalAuthGuard]));
      });
    });

    describe('@Post', () => {
      it('should have the correct path', () => {
        const path = Reflect.getMetadata(
          'path',
          AuthController.prototype.login,
        );
        expect(path).toBe('login');
      });
    });

    describe('@HttpCode', () => {
      it('should have the correct status code', () => {
        const statusCode = Reflect.getMetadata(
          '__httpCode__',
          AuthController.prototype.login,
        );
        expect(statusCode).toBe(200);
      });
    });

    it('should return a JWT token', async () => {
      const user = { username: 'user', userId: 1 };
      const token = 'jwt-token';

      jest
        .spyOn(authService, 'login')
        .mockImplementationOnce(async () => ({ access_token: token }));

      expect(await authController.login(user)).toStrictEqual({
        access_token: token,
      });
      expect(authService.login).toHaveBeenCalledWith(user);
    });

    it("should return an error if login doesn't work", async () => {
      const user = { username: 'user', userId: 1 };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());
      try {
        await authController.login(user);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error).toHaveProperty('status', 401);
        expect(error).toHaveProperty('message', 'Unauthorized');
      }
    });
  });
});
