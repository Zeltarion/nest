import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { FacebookLoginDto } from './dto/facebookLogin.dto';
import { PasswordService } from '../core/password.service';
import { TokenResponse } from './interfaces/token-response.interface';
// import {promisify} from 'util';

@Controller('')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) { }

  @Post('login')
  async login(@Body() { email, password }: LoginDto): Promise<TokenResponse> {
    const user = await this.userService.findByEmailAuth(email);
    if (!user) { throw new HttpException('User was not found', HttpStatus.NOT_FOUND); }
    const isValid = await this.passwordService.comparePassword(password, user.password);
    if (!isValid) { throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED); }

    return this.authService.createToken(email, user.id);
  }

  @Get('login/facebook')
  @UseGuards(AuthGuard('facebook'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  // @Post('facebook/login')
  // async facebookLogin(@Body() { token }: FacebookLoginDto)/*: Promise<TokenResponse>*/ {
  //   /*const user = await this.userService.findByEmailAuth(email);
  //   if (!user) { throw new HttpException('User was not found', HttpStatus.NOT_FOUND); }
  //   const isValid = await this.passwordService.comparePassword(password, user.password);
  //   if (!isValid) { throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED); }
  //
  //   return this.authService.createToken(email, user.id);*/
  //
  //   passport.use(new FacebookTokenStrategy({
  //       clientID: FACEBOOK_APP_ID,
  //       clientSecret: FACEBOOK_APP_SECRET
  //     }, function(accessToken, refreshToken, profile, done) {
  //       User.findOrCreate({facebookId: profile.id}, function (error, user) {
  //         return done(error, user);
  //       });
  //     }
  //   ));
  // }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt'))
  async refreshToken(@Req() req): Promise<TokenResponse> {
    const { email, id } = req.user;
    return this.authService.createToken(email, id);
  }
}
