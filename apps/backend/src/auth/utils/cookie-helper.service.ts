import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request, Response } from 'express';
import config from '../../config/config';

export class AuthRequestHelper {
  constructor(@Inject(config.KEY) private readonly configObject: ConfigType<typeof config>) {}

  static readonly JWT_COOKIE_NAME = 'jwt';

  attachJwtTokenToCookie(res: Response, token: string) {
    const secure = this.configObject.NODE_ENV === 'production';

    res.cookie(AuthRequestHelper.JWT_COOKIE_NAME, token, { httpOnly: true, secure });
  }

  clearJwtTokenFromCookie(res: Response) {
    res.clearCookie(AuthRequestHelper.JWT_COOKIE_NAME);
  }

  getJwtTokenFromCookie(req: Request): string {
    return req.cookies[AuthRequestHelper.JWT_COOKIE_NAME];
  }

  redirectToFrontendHomePage(res: Response) {
    res.redirect(this.configObject.FRONTEND_URL);
  }

  redirectToFrontendSignUpPatientPage(res: Response, token: string) {
    const { FRONTEND_URL, FRONTEND_SIGNUP_PATH } = this.configObject;

    res.redirect(`${FRONTEND_URL}/${FRONTEND_SIGNUP_PATH}?token=${token}`);
  }

  redirectToFrontendSignUpPage(res: Response) {
    const { FRONTEND_URL } = this.configObject;
    res.redirect(`${FRONTEND_URL}/signup`);
  }
}
