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
import { mockUndefined, pipe } from '../src/utils/test-injection-mock';
import { DeclarationModule } from '../src/declaration/declaration.module';
import { MinioService } from '../src/minio/minio.service';
import { UserModule } from '../src/user/user.module';

describe('DeclarationController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let patient: Patient;
  let doctor: Doctor;
  let patientJWTCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DeclarationModule,
        AuthModule,
        UserModule,
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
    app.use(cookieParser());

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
      data: { id: randomUUID(), ...patientStub(), user: { connect: { id: patientUser.id } } },
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
      data: { id: randomUUID(), ...doctorStub(), user: { connect: { id: doctorUser.id } } },
    });
  });

  afterEach(async () => {
    await prisma.declaration.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('/declaration (GET)', () => {
    it('Should return list of declarations', async () => {
      await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get('/declaration').set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ patientId: patient.id, doctorId: doctor.id }]);
    });
  });

  describe('/declaration (POST)', () => {
    it('Should create a new declaration', async () => {
      const response = await request(app.getHttpServer())
        .post('/declaration')
        .set('Cookie', [patientJWTCookie])
        .send({ doctorId: doctor.id, patientId: patient.id });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ doctorId: doctor.id });
      expect(response.body.id).toBeDefined();
    });

    it('Should return 404 for non-existent patient', async () => {
      const patientId = randomUUID();

      const response = await request(app.getHttpServer()).post('/declaration').send({
        doctorId: doctor.id,
        patientId: patientId,
      });

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'Patient with that id not found', statusCode: 404 });
    });

    it('Should return 404 for non-existent doctor', async () => {
      const doctorId = randomUUID();

      const response = await request(app.getHttpServer()).post('/declaration').send({
        doctorId: doctorId,
        patientId: patient.id,
      });

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'Doctor with that id not found', statusCode: 404 });
    });

    it('Should return Bad request if declaration already exists', async () => {
      await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).post('/declaration').send({
        doctorId: doctor.id,
        patientId: patient.id,
      });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Declaration already exists.', statusCode: 400 });
    });
  });

  describe('/declaration/:id (GET)', () => {
    it('Should return declaration by id', async () => {
      const declaration = await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/declaration/${declaration.id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ id: declaration.id, patientId: patient.id, doctorId: doctor.id });
    });

    it('Should return 404 for non-existent declaration', async () => {
      const declarationId = randomUUID();

      const response = await request(app.getHttpServer()).get(`/declaration/${declarationId}`);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'Declaration with this Id not found.', statusCode: 404 });
    });
  });

  describe('/declaration/my (GET)', () => {
    it('Should declaration of the patient', async () => {
      await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get('/declaration/my').set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ patientId: patient.id, doctorId: doctor.id }]);
    });
    it('Should return Unathorized error if no cookie with JWT token is present', async () => {
      await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get('/declaration/my');

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ message: 'Unauthorized', statusCode: 401 });
    });
  });

  describe('/declaration/patient/:id (GET)', () => {
    it('Should declaration by the id of the patient', async () => {
      await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/declaration/patient/${patient.id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ patientId: patient.id, doctorId: doctor.id }]);
    });

    it('Should return 404 for non-existent patient', async () => {
      const patientId = randomUUID();

      const response = await request(app.getHttpServer()).get(`/declaration/patient/${patientId}`);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'Patient with that id not found', statusCode: 404 });
    });
  });

  describe('/declaration/doctor/:id (GET)', () => {
    it('Should list of declarations of the doctor', async () => {
      const declaration1 = await prisma.declaration.create({
        data: {
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/declaration/patient/${patient.id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ id: declaration1.id, patientId: patient.id, doctorId: doctor.id }]);
    });

    it('Should return 404 for non-existent doctor', async () => {
      const doctorId = randomUUID();

      const response = await request(app.getHttpServer()).post('/declaration').send({
        doctorId: doctorId,
        patientId: patient.id,
      });

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'Doctor with that id not found', statusCode: 404 });
    });
  });

  describe('/declaration/:id (DELETE)', () => {
    it('Should delete declaration', async () => {
      const { id } = await prisma.declaration.create({
        data: { patient: { connect: { id: patient.id } }, doctor: { connect: { id: doctor.id } } },
      });

      const response = await request(app.getHttpServer())
        .delete(`/declaration/${id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);

      const existing = await prisma.favorite.findFirst({
        where: { patientId: patient.id, doctorId: doctor.id },
      });
      expect(existing).toBeNull();
    });

    it('Should return 404 for non-existent declaration', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/declaration/${id}`);

      expect(response.status).toEqual(404);
    });
  });

  afterAll(() => app.close());
});
