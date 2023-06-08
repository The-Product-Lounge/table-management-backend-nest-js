import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { UnauthorizedException } from '@nestjs/common';

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

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
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
