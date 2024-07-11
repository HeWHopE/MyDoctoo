import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { doctorStub } from '../src/doctor/doctor.stub';
import { PrismaService } from '../src/prisma/prisma.service';
import { userStub } from '../src/user/user.stub';
import { hashSync } from 'bcrypt';
import { patientStub } from '../src/patient/patient.stub';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { mockAuthConfig, mockConfig, mockMailConfig } from '../src/config/config.mock';
import { Doctor, Patient } from '@prisma/client';
import { FavoriteModule } from '../src/favorite/favorite.module';
import { PatientModule } from '../src/patient/patient.module';
import { mockUndefined, pipe } from '../src/utils/test-injection-mock';
import { MinioService } from '../src/minio/minio.service';

describe('FavoriteController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let patient: Patient;
  let doctor: Doctor;
  let patientJWTCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        FavoriteModule,
        PatientModule,
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
    const patientUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        ...userStub(),
        email: 'patient.user@test.com',
        password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
      },
    });
    patient = await prisma.patient.create({
      data: {
        id: randomUUID(),
        ...patientStub(),
        user: { connect: { id: patientUser.id } },
      },
    });
    const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
      email: 'patient.user@test.com',
      password: 'password',
    });
    patientJWTCookie = loginResponse.header['set-cookie'][0];

    const doctorUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        ...userStub(),
        email: 'doctor.user@test.com',
        password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
      },
    });
    doctor = await prisma.doctor.create({
      data: {
        id: randomUUID(),
        ...doctorStub(),
        user: { connect: { id: doctorUser.id } },
      },
    });
  });

  afterEach(async () => {
    await prisma.favorite.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('/favorite (GET)', () => {
    it('Should return list of favorites of the patient', async () => {
      await prisma.favorite.create({
        data: {
          id: randomUUID(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get('/favorite').set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ patientId: patient.id, doctorId: doctor.id }]);
    });

    it('Should return unauthorized error if cookie with a JWT token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/favorite');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });
  describe('/favorite (POST)', () => {
    it('Should create a new favorite', async () => {
      const response = await request(app.getHttpServer())
        .post('/favorite')
        .set('Cookie', [patientJWTCookie])
        .send({ doctorId: doctor.id });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ doctorId: doctor.id, patientId: patient.id });
      expect(response.body.id).toBeDefined();
    });
  });

  describe('/favorite/:id (DELETE)', () => {
    it('Should delete favorite', async () => {
      await prisma.favorite.create({
        data: { id: randomUUID(), patient: { connect: { id: patient.id } }, doctor: { connect: { id: doctor.id } } },
      });

      const response = await request(app.getHttpServer())
        .delete(`/favorite/${doctor.id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);

      const existing = await prisma.favorite.findFirst({
        where: { patientId: patient.id, doctorId: doctor.id },
      });
      expect(existing).toBeNull();
    });
  });

  afterAll(() => app.close());
});
