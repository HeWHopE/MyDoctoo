import { ConfigType } from '@nestjs/config';
import config from '../../config/config';
import { AuthRequestHelper } from './cookie-helper.service';

describe('CookieHelper', () => {
  it('Should attach JWT token to cookie', () => {
    const res = { cookie: jest.fn() } as any; // TODO: Remove any.
    const configObject: Partial<ConfigType<typeof config>> = { NODE_ENV: 'production' };
    const cookieHelper = new AuthRequestHelper(configObject as ConfigType<typeof config>);

    cookieHelper.attachJwtTokenToCookie(res, 'token');

    expect(res.cookie).toHaveBeenCalledWith(AuthRequestHelper.JWT_COOKIE_NAME, 'token', expect.any(Object));
  });
});
