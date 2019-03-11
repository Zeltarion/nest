import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook-token';
import { AuthService, Provider } from './auth.service';
import { FACCEBOOK_CLIENT_ID, FACCEBOOK_CLIENT_SECRET } from '../config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook-token') {

  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      clientID: FACCEBOOK_CLIENT_ID,
      clientSecret: FACCEBOOK_CLIENT_SECRET,
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile, done: any) {
    try {
      const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.FACEBOOK);
      const user = {
        jwt,
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }

}
