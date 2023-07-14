import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from '../../app-config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Defining a class that extends PassportStrategy
  constructor(private readonly appConfigService: AppConfigService) {
    // Defining a constructor that takes an instance of AppConfigService
    super({
      // Calling the constructor of the parent class with an object that configures the JWT strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracting the JWT from the Authorization header of the HTTP request
      ignoreExpiration: false, // Rejecting requests with expired JWTs
      secretOrKey: appConfigService.config.jwtSecret, // Using the JWT secret key from the application's configuration
    });
  }

  validate(payload: any) {
    // Defining an async method that validates the JWT payload
    if (payload.sub === 1) {
      // Checking if the sub property of the payload is equal to 1
      return true; // Returning true to indicate that the request is authenticated
    }
    throw new UnauthorizedException(); // Throwing an UnauthorizedException to indicate that the request is not authenticated
  }
}
