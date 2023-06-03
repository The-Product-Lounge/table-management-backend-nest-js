import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { pass: string }) {
    return this.authService.login(body.pass);
  }

  @Get('is-logged')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  isLogged() {
    return true;
  }
}
