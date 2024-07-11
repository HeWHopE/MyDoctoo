import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import auth from '../config/auth';
import { DoctorService } from '../doctor/doctor.service';
import { ResponseDoctorDto } from '../doctor/dto/response.dto';
import { MinioService } from '../minio/minio.service';
import { ResponsePatientDto } from '../patient/dto/response.dto';
import { PatientService } from '../patient/patient.service';
import { ResponseUserDto } from '../user/dto/response.dto';
import { JwtEmailPayload, UserService } from '../user/user.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { MeResponseDto } from './dto/getMe.dto';
import { LocalLoginTwoFactorDto } from './dto/localLoginTwoFactor.dto';
import { SignUpPatientDto } from './dto/signUpPatient.dto';
import { SignUpUserDto } from './dto/signUpUser.dto';
import { JwtPayload } from './strategies/jwt';

// TODO: refactor this service;
// there are 3 concerns to consider:
// 1. Local auth
// 2. Google auth
// 3. Helper functions for password hashing, password verification, MFA code generation and verification

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService,
    private readonly userService: UserService,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    @Inject(auth.KEY) private readonly authObject: ConfigType<typeof auth>,
    @Inject('MAIL_SERVICE') private readonly mailClient: any,
  ) {}

  onModuleInit() {
    this.mailClient.connect();
  }

  async signUpPatient(body: SignUpPatientDto, token: string): Promise<ResponsePatientDto> {
    let verified: JwtPayload;

    try {
      verified = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (err) {
      throw new BadRequestException();
    }

    const patient = await this.patientService.createPatient({ ...body, userId: verified.sub });

    await this.userService.updateEmailVerifiedStatus(verified.sub, true);

    return plainToInstance(ResponsePatientDto, patient);
  }

  async signUpUser(body: SignUpUserDto): Promise<ResponseUserDto> {
    if (body.password) {
      const user = await this.signUpUserWithPassword(body);

      return plainToInstance(ResponseUserDto, user);
    }

    throw new BadRequestException();
  }

  async signUpUserWithGoogle(body: SignUpUserDto): Promise<ResponseUserDto> {
    if (body.googleId) return await this.signUpUserWithGoogleId(body);

    throw new BadRequestException();
  }

  async validatePatientByEmail(
    email: string,
    password: string,
  ): Promise<{ isMFAEnabled: boolean; patient: ResponsePatientDto | null }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) return { isMFAEnabled: false, patient: null };

    if (user.emailVerified && !user.password) {
      throw new BadRequestException("You've signed up with Google, please use Google Sign In and then set a password.");
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) return { isMFAEnabled: false, patient: null };

    const patient = await this.patientService.getPatientByUserId(user.id);

    if (patient.twoFactorAuthToggle) {
      const { code, hashed } = await this.getMFACode();

      this.userService.updateSecretCode(user.id, hashed);
      this.mailClient.emit({ cmd: 'SendMFACode' }, { to: user.email, name: user.firstName, code: code });
    }

    return { isMFAEnabled: patient.twoFactorAuthToggle, patient };
  }

  async loginDoctor(email: string, password: string): Promise<ResponseUserDto | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user || user.role !== 'DOCTOR') throw new NotFoundException("User with this email doesn't exist");

    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) throw new BadRequestException('Invalid auth credentials.');

    return user;
  }

  async validateGoogleUser(email: string, googleId: string): Promise<ResponseUserDto | null> {
    const user = await this.userService.getUserByEmail(email).catch(() => null);
    if (!user) return null;

    const patient = await this.patientService.getPatientByUserId(user.id).catch(() => null);
    if (!patient) return null;

    if (user.googleId && user.googleId === googleId) return user;

    if (!user.googleId) {
      await this.userService.patchUser(user.id, { googleId });

      return user;
    }

    throw new BadRequestException();
  }

  async signJwtToken(id: string): Promise<string> {
    const payload: JwtPayload = { sub: id };

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1d' });

    return accessToken;
  }

  // TODO: inline this functions
  async getMePatient(user?: ResponseUserDto): Promise<ResponsePatientDto> {
    if (!user) throw new UnauthorizedException();

    const patient = await this.patientService.getPatientByUserId(user.id);

    return patient;
  }

  // TODO: inline this functions
  private async getMeDoctor(user?: ResponseUserDto): Promise<ResponseDoctorDto> {
    if (!user) throw new UnauthorizedException();
    const doctor = await this.doctorService.getDoctorByUserId(user.id);
    return doctor;
  }

  jwtCloseToExpire(token: string): boolean {
    const payload = this.jwtService.decode<JwtPayload & { exp: number }>(token);

    if (!payload || !payload.sub || !payload.exp) return false;

    // payload.exp => seconds
    const intervalLeft = payload.exp - Date.now() / 1000;

    if (intervalLeft < 0) return false;

    const isCloseToExpire = intervalLeft < this.authObject.JWT_EXPIRATION_TRESHOLD_SECONDS;

    return isCloseToExpire;
  }

  async verifyMFA(body: LocalLoginTwoFactorDto): Promise<ResponseUserDto> {
    const user = await this.userService.getUserByEmail(body.email);

    if (!user) throw new BadRequestException('Requested user not found.');

    const patient = await this.patientService.getPatientByUserId(user.id);
    if (!patient.twoFactorAuthToggle) throw new BadRequestException('MFA is not enabled for this user.');

    const isValidPassword = await this.verifyPassword(body.password, user.password);

    if (!isValidPassword) throw new BadRequestException('Invalid auth credentials.');

    const isValidCode = await this.verifyMFACode(body.code, user.secretCode);

    if (!isValidCode) throw new BadRequestException('Invalid auth credentials.');

    await this.userService.updateSecretCode(user.id, null);

    return user;
  }

  async changeEmail(user: ResponseUserDto, token: string): Promise<void> {
    const verified = await this.jwtService.verifyAsync<JwtEmailPayload>(token).catch(() => {
      throw new BadRequestException('Invalid token.');
    });
    const { sub, newEmail } = verified;
    if (sub !== user.id) throw new BadRequestException('Token is not valid for this user.');
    if (!newEmail) throw new BadRequestException('Invalid token.');

    await this.userService.changeEmail(user.id, newEmail);
  }

  async changePassword(user: ResponseUserDto, body: ChangePasswordDto): Promise<void> {
    const { password } = await this.userService.getUserByEmail(user.email);

    if (password) {
      const isPasswordValid = await this.verifyPassword(body.oldPassword, password);

      if (!isPasswordValid) throw new BadRequestException('Old password is not correct.');
    }

    const hashedPassword = await this.hashPassword(body.newPassword);

    await this.userService.patchUser(user.id, { password: hashedPassword });
  }

  async getMe(user?: ResponseUserDto): Promise<MeResponseDto> {
    if (!user) throw new UnauthorizedException();
    const response = new MeResponseDto();
    response.role = user.role;
    if (user.role === 'PATIENT') response.patient = await this.getMePatient(user);
    else if (user.role === 'DOCTOR') response.doctor = await this.getMeDoctor(user);
    return response;
  }

  private async signUpUserWithPassword(body: SignUpUserDto): Promise<ResponseUserDto> {
    const existingUser: User = await this.userService.getUserByEmail(body.email);
    if (existingUser && existingUser.emailVerified) throw new BadRequestException('Requested user already exists.');

    if (existingUser) {
      await this.userService.patchUser(existingUser.id, {
        email: body.email,
        firstName: body.firstName,
        phone: body.phone,
        lastName: body.lastName,
        password: await this.hashPassword(body.password),
      });

      const token = await this.jwtService.signAsync(
        { sub: existingUser.id },
        { expiresIn: this.authObject.JWT_EXPIRATION_DAYS },
      );
      this.mailClient.emit(
        { cmd: 'SendPatientSignUpMail' },
        { to: existingUser.email, name: existingUser.firstName, token: token },
      );

      return plainToInstance(ResponseUserDto, existingUser);
    }

    const password = await this.hashPassword(body.password);
    const user = await this.createUser({ ...body, password });

    await this.uploadAvatar(user.id, body.avatarImgUrl).catch(() => {});

    const token = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '1d' });

    this.mailClient.emit({ cmd: 'SendPatientSignUpMail' }, { to: user.email, name: user.firstName, token: token });

    return plainToInstance(ResponseUserDto, user);
  }

  private async uploadAvatar(userId: string, avatarImgUrl?: string): Promise<void> {
    const imageUrl = avatarImgUrl ?? '';
    const { name } = await this.minioService.uploadByUrl(imageUrl);
    await this.userService.patchUser(userId, { avatarKey: name });
  }

  private async signUpUserWithGoogleId(body: SignUpUserDto): Promise<ResponseUserDto> {
    const existingUser: User = await this.userService.getUserByEmail(body.email);
    if (existingUser && existingUser.emailVerified) throw new BadRequestException('Requested user already exists.');

    if (existingUser) {
      const password = body.password ? await this.hashPassword(body.password) : undefined;

      await this.userService.patchUser(existingUser.id, {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        googleId: body.googleId,
        password,
      });

      return plainToInstance(ResponseUserDto, existingUser);
    }

    const user = await this.userService.createUser({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      googleId: body.googleId,
      avatarKey: '',
      role: body.role,
    });

    await this.uploadAvatar(user.id, body.avatarImgUrl).catch(() => {});

    return plainToInstance(ResponseUserDto, user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.authObject.SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) return false;
    const isValidPassword = await bcrypt.compare(password, hash);

    return isValidPassword;
  }

  private async getMFACode(): Promise<{ code: string; hashed: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(code, 10);

    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    return { code, hashed: `${hashed}:separator:${expirationTime.toISOString()}` };
  }

  private async verifyMFACode(code: string, hashed: string): Promise<boolean> {
    const [hash, expiration] = hashed.split(':separator:');

    if (!hash || !expiration) return false;

    const isValid = await bcrypt.compare(code, hash);

    if (!isValid) return false;

    if (new Date(Date.parse(expiration)) < new Date()) return false;

    return true;
  }

  private async createUser(body: SignUpUserDto): Promise<ResponseUserDto> {
    const { email, firstName, lastName, phone, googleId, password, role } = body;

    const user = await this.userService.createUser({
      email,
      firstName,
      lastName,
      phone,
      googleId,
      ...(password ? { password } : {}),
      avatarKey: '',
      role,
    });

    return plainToInstance(ResponseUserDto, user);
  }

  async getIsPasswordExist(email: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);
    return !!user.password;
  }
}
