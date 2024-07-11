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
import { Doctor, Patient, User } from '@prisma/client';
import { mockUndefined, pipe } from '../src/utils/test-injection-mock';
import { ReviewModule } from '../src/review/review.module';
import { reviewStub } from '../src/review/review.stub';
import { MinioService } from '../src/minio/minio.service';

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let patient: Patient;
  let patientUser: User;
  let doctor: Doctor;
  let doctorUser: User;
  let patientJWTCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ReviewModule,
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
    patientUser = await prisma.user.create({
      data: {
        ...userStub(),
        email: 'patient.user@test.com',
        password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
      },
    });
    patient = await prisma.patient.create({
      data: {
        ...patientStub(),
        user: { connect: { id: patientUser.id } },
      },
    });
    const loginResponse = await request(app.getHttpServer()).post('/auth/login/patient').send({
      email: 'patient.user@test.com',
      password: 'password',
    });
    patientJWTCookie = loginResponse.header['set-cookie'][0];

    doctorUser = await prisma.user.create({
      data: {
        ...userStub(),
        email: 'doctor.user@test.com',
        password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
      },
    });
    doctor = await prisma.doctor.create({
      data: {
        ...doctorStub(),
        user: { connect: { id: doctorUser.id } },
      },
    });
  });

  afterEach(async () => {
    await prisma.review.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('/review (GET)', () => {
    it('Should return list of reviews', async () => {
      await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get('/review');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ ...reviewStub(), doctorId: doctor.id }]);
      expect(response.body[0].id).toBeDefined();
    });
  });

  describe('/review/doctor/:doctorId (GET)', () => {
    it('Should return list of reviews of doctor', async () => {
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get(`/review/doctor/${doctor.id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ id: review.id, ...reviewStub(), doctorId: doctor.id }]);
    });

    it('Should return list of reviews of doctor with names if "includeNames" query param is present', async () => {
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get(`/review/doctor/${doctor.id}?includeNames=true`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([
        {
          id: review.id,
          ...reviewStub(),
          doctorId: doctor.id,
          doctor: { user: { firstName: doctorUser.firstName, lastName: doctorUser.lastName } },
          patient: { user: { firstName: patientUser.firstName, lastName: patientUser.lastName } },
        },
      ]);
    });

    it('Should return Bad request for invalid "skip" parameter', async () => {
      const skip = 'skip';
      const response = await request(app.getHttpServer()).get(`/review/doctor/${doctor.id}?skip=${skip}`);

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Skip query parameter must be a number.' });
    });

    it('Should return Bad request for invalid "take" parameter', async () => {
      const take = 'take';
      const response = await request(app.getHttpServer()).get(`/review/doctor/${doctor.id}?take=${take}`);

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({ message: 'Take query parameter must be a number.' });
    });
  });

  // fails because aggregate functionality is not implemented in prisma-mock package yet

  // describe('/review/doctor/:doctorId/average (GET)', () => {
  //   it('Should return average rate and count of reviews of doctor', async () => {
  //     const review1 = await prisma.review.create({
  //       data: {
  //         ...reviewStub(),
  //         patient: { connect: { id: patient.id } },
  //         doctor: { connect: { id: doctor.id } },
  //       },
  //     });

  //     const patientUser2 = await prisma.user.create({
  //       data: {
  //         ...userStub(),
  //         email: 'patient.user.2@test.com',
  //         password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
  //       },
  //     });
  //     const patient2 = await prisma.patient.create({
  //       data: {
  //         ...patientStub(),
  //         user: { connect: { id: patientUser2.id } },
  //       },
  //     });

  //     const review2 = await prisma.review.create({
  //       data: {
  //         ...reviewStub(),
  //         rate: 3,
  //         patient: { connect: { id: patient2.id } },
  //         doctor: { connect: { id: doctor.id } },
  //       },
  //     });

  //     const response = await request(app.getHttpServer()).get(`/review/doctor/${doctor.id}/average`);

  //     expect(response.status).toEqual(200);
  //     expect(response.body).toMatchObject({ avg: (review1.rate + review2.rate) / 2, count: 2 });
  //   });
  // });

  describe('/review/:id (GET)', () => {
    it('Should return review', async () => {
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get(`/review/${review.id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        id: review.id,
        ...reviewStub(),
        doctorId: doctor.id,
      });
    });

    it('Should return 404 for non-existent review', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/review/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: `Review with id ${id} does not exist` });
    });
  });

  describe('/review/doctor/:doctorId (POST)', () => {
    it('Should create a new review for a doctor', async () => {
      const response = await request(app.getHttpServer())
        .post(`/review/doctor/${doctor.id}`)
        .set('Cookie', [patientJWTCookie])
        .send(reviewStub());

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ ...reviewStub(), doctorId: doctor.id });
      expect(response.body.id).toBeDefined();
    });

    it('Should return Unauthorized if no cookie with JWT token is present', async () => {
      const response = await request(app.getHttpServer()).post(`/review/doctor/${doctor.id}`).send(reviewStub());

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ statusCode: 401, message: 'Unauthorized' });
    });

    it('Should return 404 for non-existent doctor', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .post(`/review/doctor/${id}`)
        .send(reviewStub())
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: `Doctor with this Id not found.` });
    });
  });

  describe('/review/:reviewId (PATCH)', () => {
    it('Should return updated review', async () => {
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const delta = { text: 'updated review text', rate: 1 };

      const response = await request(app.getHttpServer())
        .patch(`/review/${review.id}`)
        .send(delta)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ id: review.id, ...reviewStub(), ...delta, doctorId: doctor.id });
    });

    it('Should return Unauthorized if no cookie with JWT token is present', async () => {
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const delta = { text: 'updated review text', rate: 1 };

      const response = await request(app.getHttpServer()).patch(`/review/${review.id}`).send(delta);

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({ statusCode: 401, message: 'Unauthorized' });
    });

    it('Should return Unathorized if patient tries to update review created by someone else', async () => {
      const patientUser2 = await prisma.user.create({
        data: {
          ...userStub(),
          email: 'patient.user.2@test.com',
          password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
        },
      });
      const patient2 = await prisma.patient.create({
        data: {
          ...patientStub(),
          user: { connect: { id: patientUser2.id } },
        },
      });
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient2.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const delta = { text: 'updated review text', rate: 1 };

      const response = await request(app.getHttpServer())
        .patch(`/review/${review.id}`)
        .send(delta)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: `Patient is not authorized to update review with this Id.`,
      });
    });

    it('Should return 404 for non-existent review', async () => {
      const id = randomUUID();

      const delta = { text: 'updated review text', rate: 1 };

      const response = await request(app.getHttpServer())
        .patch(`/review/${id}`)
        .send(delta)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: `Review with id ${id} does not exist` });
    });
  });

  describe('/review/:id (DELETE)', () => {
    it('Should delete review', async () => {
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/review/${review.id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);

      const existing = await prisma.review.findFirst({
        where: { patientId: patient.id, doctorId: doctor.id },
      });
      expect(existing).toBeNull();
    });

    it('Should return Unathorized if patient tries to delete review created by someone else', async () => {
      const patientUser2 = await prisma.user.create({
        data: {
          ...userStub(),
          email: 'patient.user.2@test.com',
          password: hashSync('password', mockAuthConfig.SALT_ROUNDS),
        },
      });
      const patient2 = await prisma.patient.create({
        data: {
          ...patientStub(),
          user: { connect: { id: patientUser2.id } },
        },
      });
      const review = await prisma.review.create({
        data: {
          ...reviewStub(),
          patient: { connect: { id: patient2.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/review/${review.id}`)
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: `Patient with id ${patient.id} is not authorized to delete review with id ${review.id}`,
      });
    });

    it('Should return 404 for non-existent review', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/review/${id}`);

      expect(response.status).toEqual(404);
    });
  });

  afterAll(() => app.close());
});
