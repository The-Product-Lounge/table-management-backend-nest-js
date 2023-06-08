import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

const mockJwtService = {
  sign: () => 'mock-token',
};

const mockAppConfigService = {
  // mock implementation
};
const mockJwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const pass = 'password';
      const token = 'jwt-token';

      jest
        .spyOn(authService, 'login')
        .mockImplementationOnce(async () => ({ access_token: token }));

      expect(await authController.login({ pass })).toStrictEqual({
        access_token: token,
      });
      expect(authService.login).toHaveBeenCalledWith(pass);
    });

    it("should return an error if login doesn't work", async () => {
      const body = { pass: 'incorrect_password' };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());
      try {
        await authController.login(body);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error).toHaveProperty('status', 401);
        expect(error).toHaveProperty('message', 'Unauthorized');
      }
    });
  });
});
