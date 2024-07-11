import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';
import { AuthRequestHelper } from './utils/cookie-helper.service';

describe('AuthController', () => {
  let authServiceMock: AuthService;
  let controller: AuthController;
  let authRequestHelperMock: Partial<AuthRequestHelper> = {};

  const mockMailService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AuthRequestHelper, useValue: authRequestHelperMock },
        { provide: 'MAIL_SERVICE', useValue: mockMailService },
      ],
    })
      .useMocker(pipe(mockUndefined, mockConfigs))
      .compile();

    authServiceMock = moduleRef.get<AuthService>(AuthService);
    authRequestHelperMock = moduleRef.get<AuthRequestHelper>(AuthRequestHelper);
    controller = moduleRef.get<AuthController>(AuthController);
  });

  it('localLogin: should not login with invalid credentials', async () => {
    authServiceMock.validatePatientByEmail = jest.fn().mockResolvedValue({
      isMFAEnabled: false,
      patient: null,
    });

    await expect(controller.localLogin(jest.fn() as any, { email: 'email', password: 'password' })).rejects.toThrow();
  });

  it('localLogin: should not login with mfa enabled', async () => {
    authRequestHelperMock.attachJwtTokenToCookie = jest.fn().mockReturnThis();
    authServiceMock.validatePatientByEmail = jest.fn().mockResolvedValue({
      isMFAEnabled: true,
      patient: {},
    });
    await expect(
      controller.localLogin(jest.fn() as any, { email: 'email', password: 'password' }),
    ).resolves.toMatchObject({
      isMFAEnabled: true,
    });

    expect(authRequestHelperMock.attachJwtTokenToCookie).toHaveBeenCalledTimes(0);
  });

  it('localLogin: should login patient', async () => {
    authRequestHelperMock.attachJwtTokenToCookie = jest.fn().mockReturnThis();
    authServiceMock.validatePatientByEmail = jest.fn().mockResolvedValue({
      isMFAEnabled: false,
      patient: {},
    });
    await expect(
      controller.localLogin(jest.fn() as any, { email: 'email', password: 'password' }),
    ).resolves.toMatchObject({
      isMFAEnabled: false,
    });

    expect(authRequestHelperMock.attachJwtTokenToCookie).toHaveBeenCalledTimes(1);
  });
});
