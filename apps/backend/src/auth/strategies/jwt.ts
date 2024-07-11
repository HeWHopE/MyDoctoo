import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import auth from '../../config/auth';
import { UserService } from '../../user/user.service';
import { JWT_STRATEGY_NAME } from '../../utils/constants';
import { AuthService } from '../auth.service';
import { AuthRequestHelper } from '../utils/cookie-helper.service';

export type JwtPayload = { sub?: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(
    @Inject(auth.KEY) readonly authObject: ConfigType<typeof auth>,
    private readonly authService: AuthService,
    private readonly cookieHelper: AuthRequestHelper,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: authObject.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    if (!payload || payload.sub == undefined) return null;

    const user = await this.userService.getUser(payload.sub);

    if (user) await this.prolongTokenLifeIfNeeded(user.id, req);

    return user;
  }

  private async prolongTokenLifeIfNeeded(userId: string, req: Request) {
    const token = this.cookieHelper.getJwtTokenFromCookie(req);

    const isCloseToExpire = this.authService.jwtCloseToExpire(token);

    if (!isCloseToExpire) return;

    const res = req.res;

    const newToken = await this.authService.signJwtToken(userId);

    this.cookieHelper.attachJwtTokenToCookie(res, newToken);
  }
}

const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies[AuthRequestHelper.JWT_COOKIE_NAME];
  }

  return token;
};
