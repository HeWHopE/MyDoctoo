import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import auth from '../../config/auth';
import { ResponseUserDto } from '../../user/dto/response.dto';
import { AuthService } from '../auth.service';
import { GoogleSignInResponseDto } from '../dto/googleSignInResponse.dto';
import { AuthRequestHelper } from '../utils/cookie-helper.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(auth.KEY) authConfig: ConfigType<typeof auth>,
  ) {
    super({
      clientID: authConfig.GOOGLE_CLIENT_ID,
      clientSecret: authConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: authConfig.GOOGLE_REDIRECT_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<GoogleSignInResponseDto> {
    const email = profile.emails[0];

    const user = await this.authService.validateGoogleUser(email.value, profile.id);

    if (!user) {
      const { name, id, photos } = profile;

      try {
        const newUser = await this.authService.signUpUserWithGoogle({
          lastName: name.familyName,
          firstName: name.givenName,
          email: email.value,
          googleId: id,
          phone: '', // TODO: Add phone to GoogleStrategy.
          avatarImgUrl: photos[0].value,
          role: 'PATIENT',
        });

        return { isLoggedIn: false, user: newUser };
      } catch (err) {
        return {
          isLoggedIn: false,
          user: null,
        };
      }
    }

    return { isLoggedIn: true, user };
  }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly cookieHelper: AuthRequestHelper) {
    super();
  }

  handleRequest<TUser = ResponseUserDto>(err: any, user: TUser, _info: any, context: ExecutionContext): TUser {
    if (err || !user) {
      const res = context.switchToHttp().getResponse();
      return void this.cookieHelper.redirectToFrontendSignUpPage(res);
    }

    return user;
  }
}
