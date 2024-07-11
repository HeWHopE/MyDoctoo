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
import { User } from '@prisma/client';
import { mockUndefined, pipe } from '../src/utils/test-injection-mock';
import { UserModule } from '../src/user/user.module';
import { patientStub } from '../src/patient/patient.stub';
import { MinioService } from '../src/minio/minio.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let userJWTCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
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
      .useValue({ connect: jest.fn() })
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

  beforeEach(async () => {
    user = await prisma.user.create({
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
    userJWTCookie = loginResponse.header['set-cookie'][0];
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('/user/me (GET)', () => {
    it('Should return logged in user data', async () => {
      const response = await request(app.getHttpServer()).get('/user/me').set('Cookie', [userJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarKey: user.avatarKey,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
      });
      expect(response.body.password).toBeUndefined();
    });

    it('Should return Unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/user/me');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });

  describe('/user/:id (GET)', () => {
    it('Should return user by id', async () => {
      const response = await request(app.getHttpServer()).get(`/user/${user.id}`).set('Cookie', [userJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarKey: user.avatarKey,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
      });
      expect(response.body.password).toBeUndefined();
    });

    it('Should return 404 for non-existent user', async () => {
      const id = randomUUID();
      const response = await request(app.getHttpServer()).get(`/user/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'A user with this Id not found.' });
    });
  });

  describe('/user (POST)', () => {
    it('Should return created user', async () => {
      const response = await request(app.getHttpServer()).post('/user').send(userStub());

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ ...userStub(), emailVerified: false });
      expect(response.body.password).toBeUndefined();
    });

    it('Should fail validation of phone', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send({ ...userStub(), phone: '123' });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Validation failed', errors: [{ property: 'phone' }] });
    });

    it('Should fail validation of email', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send({ ...userStub(), email: 'email' });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Validation failed', errors: [{ property: 'email' }] });
    });

    it('Should return Bad request on not unique email', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send({ ...userStub(), email: user.email });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'A user with this email already exists.' });
    });
  });

  describe('/user/:id (PATCH)', () => {
    it('Should update user', async () => {
      const { id } = await prisma.user.create({
        data: { id: randomUUID(), ...userStub(), email: 'user.to.be.updated@test.com', password: 'pass' },
      });

      const delta = {
        firstName: 'updated first name',
        lastName: 'updated last name',
      };

      const response = await request(app.getHttpServer()).patch(`/user/${id}`).send(delta);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ ...userStub(), email: 'user.to.be.updated@test.com', ...delta });
    });

    it('Should return 404 for non-existent user', async () => {
      const id = randomUUID();

      const delta = {
        firstName: 'updated first name',
        lastName: 'updated last name',
      };

      const response = await request(app.getHttpServer()).patch(`/user/${id}`).send(delta);

      expect(response.status).toEqual(404);
    });
  });

  describe('/user/:id (DELETE)', () => {
    it('Should delete user', async () => {
      const { id } = await prisma.user.create({
        data: { id: randomUUID(), ...userStub(), email: 'user.to.be.deleted@test.com' },
      });

      const response = await request(app.getHttpServer()).delete(`/user/${id}`);

      expect(response.status).toEqual(200);

      const existing = await prisma.user.findFirst({
        where: { id },
      });
      expect(existing).toBeNull();
    });

    it('Should return 404 for non-existent user', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/user/${id}`);

      expect(response.status).toEqual(404);
    });
  });

  afterAll(() => app.close());
});
