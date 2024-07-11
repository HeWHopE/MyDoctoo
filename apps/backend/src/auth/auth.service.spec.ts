import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import auth from '../config/auth';
import config from '../config/config';
import { MinioService } from '../minio/minio.service';
import { CreatePatientDto } from '../patient/dto/create.dto';
import { PatientService } from '../patient/patient.service';
import { CreateUserDto } from '../user/dto/create.dto';
import { ResponseUserDto } from '../user/dto/response.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { mockUndefined, pipe } from 'src/utils/test-injection-mock';

describe('AuthService', () => {
  let authService: AuthService;
  let user: CreateUserDto;
  let patient: CreatePatientDto;

  const userServiceMock: Partial<UserService> = {};
  const patientServiceMock: Partial<PatientService> = {};
  const authConfig: Partial<ConfigType<typeof auth>> = {};
  const minioServiceMock: Partial<MinioService> = {};
  const mockMailService = {
    send: jest.fn(),
    emit: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: PatientService, useValue: patientServiceMock },
        { provide: config.KEY, useValue: config },
        { provide: auth.KEY, useValue: authConfig },
        { provide: MinioService, useValue: minioServiceMock },
        { provide: 'MAIL_SERVICE', useValue: mockMailService },
      ],
    })
      .useMocker(pipe(mockUndefined))
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(null);

    user = plainToInstance(CreateUserDto, {
      avatarKey: 'key',
      email: 'user@gmail.com',
      firstName: 'First Name',
      lastName: 'Last Name',
      password: 'password',
      phone: '+380501804066',
      googleId: null,
    });

    patient = plainToClass(CreatePatientDto, {});
  });

  it('Should be defined', () => expect(authService).toBeDefined());

  it('Should signup user', async () => {
    userServiceMock.createUser = jest.fn().mockResolvedValue({ ...user, id: '1' });
    patientServiceMock.createPatient = jest.fn().mockResolvedValue({ ...patient, id: '2' });

    const signedUp = await authService.signUpUser(user);

    const { password, ...userWithoutPassword } = user;

    expect(password).toEqual(expect.any(String));
    expect(signedUp).toEqual(expect.objectContaining({ id: '1', ...userWithoutPassword }));
    expect(userServiceMock.createUser).toHaveBeenCalledWith({
      ...user,
      password: expect.not.stringMatching(user.password),
      avatarKey: expect.any(String),
    });
  });

  it('Should validate credentials', async () => {
    const password = bcrypt.hashSync(user.password, 10);

    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue({ ...user, password });

    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue({ ...user, password });

    patientServiceMock.getPatientByUserId = jest.fn().mockResolvedValue(patient);

    const validated = await authService.validatePatientByEmail(user.email, user.password);

    expect(validated).not.toBeNull();
  });

  it('Should fail credentials validation', async () => {
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(user);
    patientServiceMock.getPatientByUserId = jest.fn().mockResolvedValue(patient);

    const validated = await authService.validatePatientByEmail(user.email, 'invalid_password');

    expect(validated.patient).toBeNull();
  });

  it('Should validate Google', async () => {
    user = { ...user, googleId: 'googleId' };

    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(user);
    patientServiceMock.getPatientByUserId = jest.fn().mockResolvedValue(patient);

    const validated = await authService.validateGoogleUser(user.email, 'googleId');

    expect(validated).toEqual({ ...user, password: expect.anything() });
  });

  it('Should fail Google validation', async () => {
    user = { ...user, googleId: 'googleId' };

    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(user);

    expect(authService.validateGoogleUser(user.email, 'invalid_googleId')).rejects.toThrow('Bad Request');
  });

  it('Should signup user with valid googleId', async () => {
    const { password, ...userWithoutPassword } = user;
    const newUser = { ...userWithoutPassword, googleId: 'googleId' };

    userServiceMock.createUser = jest.fn().mockResolvedValue(newUser);

    expect(password).toEqual(expect.any(String));
    expect(authService.signUpUserWithGoogle({ ...newUser })).resolves.toEqual({ ...newUser });
  });

  it('Should fail signup without valid googleId', async () => {
    user = { ...user, googleId: null, password: null };

    const signUpDto = { ...user, ...patient };

    expect(authService.signUpUserWithGoogle(signUpDto)).rejects.toThrow();
  });

  it("Shouldn't prolong token's life", async () => {
    authConfig.JWT_EXPIRATION_TRESHOLD_SECONDS = 60;
    authConfig.JWT_EXPIRATION_DAYS = '0d';

    const token = await authService.signJwtToken('1');

    const result = authService.jwtCloseToExpire(token);

    expect(result).toBeFalsy();
  });

  it('Should not login patient with MFA', async () => {
    const password = bcrypt.hashSync(user.password, 10);
    const newUser: Partial<ResponseUserDto> = { id: '1', ...user, password };

    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(newUser);
    patientServiceMock.getPatientByUserId = jest.fn().mockResolvedValue({ ...patient, twoFactorAuthToggle: true });
    userServiceMock.updateSecretCode = jest.fn().mockReturnThis();

    const result = await authService.validatePatientByEmail(user.email, user.password);

    expect(result.isMFAEnabled).toBeTruthy();
    expect(userServiceMock.updateSecretCode).toHaveBeenCalledWith(expect.any(String), expect.stringMatching(/.{7,}/));
    expect(mockMailService.emit).toHaveBeenCalled();
  });

  it('Should not change password', async () => {
    const password = bcrypt.hashSync(user.password, 10);
    const newUser: Partial<ResponseUserDto> = {
      id: '1',
      ...user,
      password,
    };

    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(newUser);
    userServiceMock.patchUser = jest.fn().mockReturnThis();

    await expect(async () => {
      await authService.changePassword(newUser as ResponseUserDto, {
        oldPassword: 'wrong_password',
        newPassword: 'new_password',
      });
    }).rejects.toThrow();
  });

  it('signUpPatient: should not signup with invalid token', async () => {
    await expect(authService.signUpPatient({ ...patient }, 'invalid_token')).rejects.toThrow();
  });

  it('signUpPatient: should signup patient', async () => {
    patientServiceMock.createPatient = jest.fn().mockResolvedValue({ ...patient, id: '2' });
    userServiceMock.updateEmailVerifiedStatus = jest.fn().mockReturnThis();
    const token = await authService.signJwtToken('1');

    await authService.signUpPatient({ ...patient }, token);

    expect(patientServiceMock.createPatient).toHaveBeenCalledWith({ ...patient, userId: '1' });
    expect(userServiceMock.updateEmailVerifiedStatus).toHaveBeenCalledWith('1', true);
  });

  it('signUpUser: should not signup user without passoword', async () => {
    await expect(authService.signUpUser({ ...user, password: null })).rejects.toThrow();
  });

  it('validatePatientByEmail: should not return not existed user', async () => {
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(null);

    await expect(authService.validatePatientByEmail(user.email, user.password)).resolves.toMatchObject({
      patient: null,
      isMFAEnabled: false,
    });
  });

  it('validatePatientByEmail: should not validate verified user without password', async () => {
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue({ ...user, password: null, emailVerified: true });

    await expect(authService.validatePatientByEmail(user.email, user.password)).rejects.toThrow();
  });

  it('validateGoogleUser: should not valiaed with user is not found', async () => {
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(null);
    await expect(authService.validateGoogleUser(user.email, 'googleId')).resolves.toBeNull();
  });

  it('validateGoogleUser: should not valiaed with patient is not found', async () => {
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue(user);
    patientServiceMock.getPatientByUserId = jest.fn().mockResolvedValue(null);
    await expect(authService.validateGoogleUser(user.email, 'googleId')).resolves.toBeNull();
  });

  it('validateGoogleUser: should valiaed registered user without google_id', async () => {
    user.googleId = null;
    userServiceMock.getUserByEmail = jest.fn().mockResolvedValue({ ...user, id: '1' });
    userServiceMock.patchUser = jest.fn().mockReturnThis();
    patientServiceMock.getPatientByUserId = jest.fn().mockResolvedValue(patient);

    await expect(authService.validateGoogleUser(user.email, 'googleId')).resolves.toMatchObject(user);
    expect(userServiceMock.patchUser).toHaveBeenCalledWith('1', { googleId: 'googleId' });
  });
});
