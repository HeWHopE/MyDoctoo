import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { userStub } from '../src/user/user.stub';
import { hashSync } from 'bcrypt';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { mockAuthConfig, mockConfig, mockMailConfig } from '../src/config/config.mock';
import { Role } from '@prisma/client';
import { mockUndefined, pipe } from '../src/utils/test-injection-mock';
import { UserModule } from '../src/user/user.module';
import { patientStub } from '../src/patient/patient.stub';
import { MinioService } from '../src/minio/minio.service';
import { doctorStub } from '../src/doctor/doctor.stub';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockMailService = {
    emit: jest.fn(),
    connect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            registerAs('mail', () => mockMailConfig),
            registerAs('auth', () => mockAuthConfig),
            registerAs('config', () => mockConfig),
          ],
        }),
      ],
      providers: [PrismaService],
    })
      .overrideProvider(MinioService)
      .useValue({})
      .overrideProvider('MAIL_SERVICE')
      .useValue(mockMailService)
      .useMocker(pipe(mockUndefined))
      .compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: errors => {
          const formattedErrors = errors.map(error => ({
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          }));

          return new BadRequestException({ message: 'Validation failed', errors: formattedErrors });
        },
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('/auth/login/patient (POST)', () => {
    it('Should log patient in', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
        },
      });
      await prisma.patient.create({
        data: {
          ...patientStub(),
          userId: user.id,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: user.email,
        password: 'asdQWE123',
      });

      expect(response.status).toEqual(201);
      expect(response.header['set-cookie'][0]).toMatch('jwt=');
    });

    it('Should not log patient in if MFA is enabled', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          email: 'user.with.mfa@test.com',
        },
      });
      await prisma.patient.create({
        data: {
          ...patientStub(),
          userId: user.id,
          twoFactorAuthToggle: true,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: user.email,
        password: 'asdQWE123',
      });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ isMFAEnabled: true });
      expect(response.header['set-cookie']).not.toBeDefined();
    });

    it('Should return Bad request on invalid email', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          email: 'user.to.fail.email@test.com',
        },
      });
      await prisma.patient.create({
        data: {
          ...patientStub(),
          userId: user.id,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: 'invalid',
        password: 'asdQWE123',
      });

      expect(response.status).toEqual(400);
    });

    it('Should return Bad request on invalid password', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          email: 'user.to.fail.password@test.com',
        },
      });
      await prisma.patient.create({
        data: {
          ...patientStub(),
          userId: user.id,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: 'user.to.fail.password@test.com',
        password: 'invalid',
      });

      expect(response.status).toEqual(400);
    });
  });

  describe('/auth/login/doctor (POST)', () => {
    it('Should log doctor in', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          role: Role.DOCTOR,
        },
      });
      await prisma.doctor.create({
        data: {
          ...doctorStub(),
          userId: user.id,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/doctor').send({
        email: user.email,
        password: 'asdQWE123',
      });

      expect(response.status).toEqual(201);
      expect(response.header['set-cookie'][0]).toMatch('jwt=');
    });

    it('Should return Bad request on invalid email', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          email: 'user.to.fail@test.com',
          role: Role.DOCTOR,
        },
      });
      await prisma.doctor.create({
        data: {
          ...doctorStub(),
          userId: user.id,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/doctor').send({
        email: 'invalid',
        password: 'asdQWE123',
      });

      expect(response.status).toEqual(400);
    });

    it('Should return Bad request on invalid password', async () => {
      const user = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          email: 'user.to.fail@test.com',
          role: Role.DOCTOR,
        },
      });
      await prisma.doctor.create({
        data: {
          ...doctorStub(),
          userId: user.id,
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login/doctor').send({
        email: 'user.to.fail@test.com',
        password: 'invalid',
      });

      expect(response.status).toEqual(400);
    });
  });

  describe('/auth/signup (POST)', () => {
    it('Should sign user up', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...userStub(),
          password: 'asdQWE123',
        });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ ...userStub(), avatarKey: '', emailVerified: false });
    });

    it('Should return Bad request if user with specified email already exists', async () => {
      await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          password: hashSync('asdQWE123', mockAuthConfig.SALT_ROUNDS),
          email: 'unique@test.com',
        },
      });
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...userStub(),
          email: 'unique@test.com',
          password: 'asdQWE123',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Requested user already exists.' });
    });

    it('Should return Bad request if the password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...userStub(),
        });

      expect(response.status).toEqual(400);
    });
  });

  describe('/auth/signup/patient/:token (POST)', () => {
    it('Should verify email', async () => {
      let token: string;
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      mockMailService.emit = (pattern: { cmd: string }, payload: { to: string; name: string; token: string }) =>
        (token = payload.token);

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...userStub(),
          password: 'asdQWE123',
        });

      const response = await request(app.getHttpServer()).post(`/auth/signup/patient/${token}`).send(patientStub());

      expect(response.status).toEqual(201);
      expect(response.header['set-cookie'][0]).toMatch('jwt=');
    });

    it('Should return Bad request if token is invalid', async () => {
      const token = 'invalid';
      const response = await request(app.getHttpServer()).post(`/auth/signup/patient/${token}`).send(patientStub());

      expect(response.status).toEqual(400);
    });
  });

  describe('/auth/logout (GET)', () => {
    it('Should log user out', async () => {
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: 'user@test.com',
          password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
        },
      });
      await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
      const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: 'user@test.com',
        password: 'password',
      });
      const cookie = loginResponse.header['set-cookie'][0];

      const response = await request(app.getHttpServer()).get('/auth/logout').set('Cookie', [cookie]);

      expect(response.status).toEqual(200);
    });

    it('Should return Unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/auth/logout');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });

  describe('/auth/password/change (POST)', () => {
    it('Should change password', async () => {
      const password = 'password';
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: 'user@test.com',
          password: hashSync(password, mockAuthConfig.SALT_ROUNDS),
        },
      });
      await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
      const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: 'user@test.com',
        password: password,
      });
      const cookie = loginResponse.header['set-cookie'][0];

      const newPassword = 'reallysecure';
      const response = await request(app.getHttpServer()).post('/auth/password/change').set('Cookie', [cookie]).send({
        oldPassword: password,
        newPassword,
      });

      expect(response.status).toEqual(201);

      const loginRetry = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: 'user@test.com',
        password: newPassword,
      });

      expect(loginRetry.status).toEqual(201);
      expect(loginRetry.header['set-cookie'][0]).toMatch('jwt=');
    });

    it('Should return Unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/auth/logout');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });

  describe('/auth/email/change (POST)', () => {
    it('Should change email', async () => {
      const email = 'old.email@test.com';
      const password = 'password';
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: email,
          password: hashSync(password, mockAuthConfig.SALT_ROUNDS),
        },
      });
      await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
      const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email,
        password,
      });
      const cookie = loginResponse.header['set-cookie'][0];

      let token: string;
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      mockMailService.emit = (
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        pattern: { cmd: string },
        payload: { to: string; oldEmail: string; name: string; token: string },
      ) => (token = payload.token);

      const newEmail = 'brand.new@test.com';
      await request(app.getHttpServer()).patch(`/user/${user.id}`).send({
        email: newEmail,
      });

      const response = await request(app.getHttpServer()).post('/auth/email/change').set('Cookie', [cookie]).send({
        token,
      });

      expect(response.status).toEqual(201);

      const loginRetry = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email: newEmail,
        password,
      });

      expect(loginRetry.status).toEqual(201);
      expect(loginRetry.header['set-cookie'][0]).toMatch('jwt=');
    });

    it('Should return Unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).post('/auth/email/change');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });

    it('Should return Bad request error if token is invalid', async () => {
      const email = 'old.email@test.com';
      const password = 'password';
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: email,
          password: hashSync(password, mockAuthConfig.SALT_ROUNDS),
        },
      });
      await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
      const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email,
        password,
      });
      const cookie = loginResponse.header['set-cookie'][0];

      const response = await request(app.getHttpServer()).post('/auth/email/change').set('Cookie', [cookie]).send({
        token: 'invalid',
      });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Invalid token.', statusCode: 400 });
    });
  });

  describe('/auth/get/me (GET)', () => {
    it('Should return logged in patient data', async () => {
      const email = 'patient.user@test.com';
      const password = 'password';
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: email,
          password: hashSync(password, mockAuthConfig.SALT_ROUNDS),
        },
      });
      const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
      const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email,
        password,
      });
      const cookie = loginResponse.header['set-cookie'][0];
      const response = await request(app.getHttpServer()).get('/auth/get/me').set('Cookie', [cookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        patient: {
          id: patient.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatarKey: user.avatarKey,
          phone: user.phone,
        },
        role: Role.PATIENT,
      });
    });

    it('Should return logged in doctor data', async () => {
      const email = 'doctor.user@test.com';
      const password = 'password';
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: email,
          password: hashSync(password, mockAuthConfig.SALT_ROUNDS),
          role: Role.DOCTOR,
        },
      });
      const doctor = await prisma.doctor.create({ data: { ...doctorStub(), user: { connect: { id: user.id } } } });
      const loginResponse = await request(app.getHttpServer()).post('/auth/login/doctor').send({
        email,
        password,
      });
      const cookie = loginResponse.header['set-cookie'][0];
      const response = await request(app.getHttpServer()).get('/auth/get/me').set('Cookie', [cookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        doctor: {
          id: doctor.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarKey: user.avatarKey,
        },
        role: Role.DOCTOR,
      });
    });

    it('Should return Unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/auth/get/me');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });

  describe('/auth/get/me/pass (GET)', () => {
    it('Should return true if user has a password', async () => {
      const email = 'user@test.com';
      const password = 'password';
      const user = await prisma.user.create({
        data: {
          ...userStub(),
          email: email,
          password: hashSync(password, mockAuthConfig.SALT_ROUNDS),
        },
      });
      await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

      const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
        email,
        password,
      });
      const cookie = loginResponse.header['set-cookie'][0];
      const response = await request(app.getHttpServer()).get('/auth/get/me/pass').set('Cookie', [cookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toBeTruthy();
    });

    it('Should return Unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/auth/get/me/pass');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });

  afterAll(() => app.close());
});
