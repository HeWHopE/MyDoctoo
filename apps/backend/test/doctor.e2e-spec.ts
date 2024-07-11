import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { DoctorModule } from '../src/doctor/doctor.module';
import { doctorStub } from '../src/doctor/doctor.stub';
import { hospitalStub } from '../src/hospital/hospital.stub';
import { PrismaService } from '../src/prisma/prisma.service';
import { specializationStub } from '../src/specialization/specialization.stub';
import { userStub } from '../src/user/user.stub';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { hashSync } from 'bcrypt';
import { patientStub } from '../src/patient/patient.stub';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { mockAuthConfig, mockConfig, mockMailConfig } from '../src/config/config.mock';
import { Patient, Role } from '@prisma/client';
import { appointmentStub } from '../src/appointment/appointment.stub';
import { MinioService } from '../src/minio/minio.service';

describe('DoctorController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let patient: Patient;
  let patientJWTCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DoctorModule,
        EventEmitterModule.forRoot(),
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
  });

  afterEach(async () => {
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.doctorSpecialization.deleteMany();
    await prisma.specialization.deleteMany();
    await prisma.hospitalDoctor.deleteMany();
    await prisma.doctorSchedule.deleteMany();
    await prisma.hospital.deleteMany();
  });

  describe('/doctor (GET)', () => {
    it('Should return array of objects', async () => {
      const user = await prisma.user.create({
        data: { id: randomUUID(), ...userStub(), role: Role.DOCTOR, email: 'doctor@email.com' },
      });
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: specialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: hospital.id } } } },
          user: { connect: { id: user.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const response = await request(app.getHttpServer()).get('/doctor').set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        doctors: [
          {
            ...doctorStub(),
            firstName: userStub().firstName,
            lastName: userStub().lastName,
            avatarKey: userStub().avatarKey,
            specializations: [{ ...specializationStub() }],
            hospitals: [{ name: hospitalStub().name }],
          },
        ],
        count: 1,
      });
    });

    it('Should return array with single doctor when specializationId param is specified', async () => {
      const dentistUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          firstName: 'first-name-dentist-user',
          lastName: 'last-name-dentist-user',
          role: Role.DOCTOR,
          email: 'dentist@email.com',
        },
      });
      const dentistSpecialization = await prisma.specialization.create({ data: { id: randomUUID(), name: 'Dentist' } });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: dentistSpecialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: hospital.id } } } },
          user: { connect: { id: dentistUser.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const surgeonUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          firstName: 'first-name-surgeon-user',
          lastName: 'last-name-surgeon-user',
          role: Role.DOCTOR,
          email: 'surgeon@email.com',
        },
      });
      const surgeonSpecialization = await prisma.specialization.create({ data: { id: randomUUID(), name: 'Surgeon' } });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: surgeonSpecialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: hospital.id } } } },
          user: { connect: { id: surgeonUser.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const response = await request(app.getHttpServer())
        .get('/doctor')
        .query({ specializationId: [surgeonSpecialization.id] })
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        doctors: [
          {
            ...doctorStub(),
            firstName: 'first-name-surgeon-user',
            lastName: 'last-name-surgeon-user',
            avatarKey: userStub().avatarKey,
            specializations: [{ name: 'Surgeon' }],
            hospitals: [{ name: hospitalStub().name }],
          },
        ],
        count: 1,
      });
    });

    it('Should return array with single doctor when hospitalId param is specified', async () => {
      const dentistUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          firstName: 'first-name-dentist-user',
          lastName: 'last-name-dentist-user',
          role: Role.DOCTOR,
          email: 'dentist@email.com',
        },
      });
      const dentistSpecialization = await prisma.specialization.create({ data: { id: randomUUID(), name: 'Dentist' } });
      const dentistHospital = await prisma.hospital.create({
        data: { id: randomUUID(), ...hospitalStub(), name: 'Chicago hospital' },
      });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: dentistSpecialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: dentistHospital.id } } } },
          user: { connect: { id: dentistUser.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const surgeonUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          firstName: 'first-name-surgeon-user',
          lastName: 'last-name-surgeon-user',
          role: Role.DOCTOR,
          email: 'surgeon@email.com',
        },
      });
      const surgeonSpecialization = await prisma.specialization.create({ data: { id: randomUUID(), name: 'Surgeon' } });
      const surgeonHospital = await prisma.hospital.create({
        data: { id: randomUUID(), ...hospitalStub(), name: 'Portland hospital' },
      });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: surgeonSpecialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: surgeonHospital.id } } } },
          user: { connect: { id: surgeonUser.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const response = await request(app.getHttpServer())
        .get('/doctor')
        .query({ hospitalId: [surgeonHospital.id] })
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        doctors: [
          {
            ...doctorStub(),
            firstName: 'first-name-surgeon-user',
            lastName: 'last-name-surgeon-user',
            avatarKey: userStub().avatarKey,
            specializations: [{ name: 'Surgeon' }],
            hospitals: [{ name: 'Portland hospital' }],
          },
        ],
        count: 1,
      });
    });

    it('Should return array with doctor matching search query', async () => {
      const dentistUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          firstName: 'first-name-dentist-user',
          lastName: 'last-name-dentist-user',
          role: Role.DOCTOR,
          email: 'dentist@email.com',
        },
      });
      const dentistSpecialization = await prisma.specialization.create({ data: { id: randomUUID(), name: 'Dentist' } });
      const dentistHospital = await prisma.hospital.create({
        data: { id: randomUUID(), ...hospitalStub(), name: 'Chicago hospital' },
      });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: dentistSpecialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: dentistHospital.id } } } },
          user: { connect: { id: dentistUser.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const surgeonUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...userStub(),
          firstName: 'first-name-surgeon-user',
          lastName: 'last-name-surgeon-user',
          role: Role.DOCTOR,
          email: 'surgeon@email.com',
        },
      });
      const surgeonSpecialization = await prisma.specialization.create({ data: { id: randomUUID(), name: 'Surgeon' } });
      const surgeonHospital = await prisma.hospital.create({
        data: { id: randomUUID(), ...hospitalStub(), name: 'Portland hospital' },
      });

      await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { create: { specialization: { connect: { id: surgeonSpecialization.id } } } },
          hospitals: { create: { hospital: { connect: { id: surgeonHospital.id } } } },
          user: { connect: { id: surgeonUser.id } },
          doctorSchedule: { create: { startsWorkHourUTC: 9, endsWorkHourUTC: 20 } },
        },
      });

      const response = await request(app.getHttpServer())
        .get('/doctor')
        .query({ search: 'surge' })
        .set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        doctors: [
          {
            ...doctorStub(),
            firstName: 'first-name-surgeon-user',
            lastName: 'last-name-surgeon-user',
            avatarKey: userStub().avatarKey,
            specializations: [{ name: 'Surgeon' }],
            hospitals: [{ name: 'Portland hospital' }],
          },
        ],
        count: 1,
      });
    });
  });

  describe('/doctor (POST)', () => {
    it('Should create a new doctor', async () => {
      const user = await prisma.user.create({ data: { id: randomUUID(), ...userStub() } });
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      const doctorData = {
        ...doctorStub(),
        userId: user.id,
        hospitalIds: [hospital.id],
        specializationIds: [specialization.id],
      };

      const response = await request(app.getHttpServer()).post('/doctor').send(doctorData);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(doctorStub());
    });

    it('Should return 404 for non-existent userId', async () => {
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      const doctorData = {
        ...doctorStub(),
        userId: randomUUID(),
        hospitalIds: [hospital.id],
        specializationIds: [specialization.id],
      };

      const response = await request(app.getHttpServer()).post('/doctor').send(doctorData);

      expect(response.status).toEqual(404);
    });
  });

  describe('/doctor/:id (GET)', () => {
    it('Should return doctor object', async () => {
      const user = await prisma.user.create({ data: { id: randomUUID(), ...userStub() } });
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      const doctorData = {
        id: randomUUID(),
        ...doctorStub(),
        userId: user.id,
        hospitalIds: [hospital.id],
        specializationIds: [specialization.id],
      };

      const { id } = await prisma.doctor.create({ data: doctorData });

      const response = await request(app.getHttpServer()).get(`/doctor/${id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(doctorStub());
    });

    it('Should return 404 for non-existent doctorId', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/doctor/${id}`);

      expect(response.status).toEqual(404);
    });
  });

  describe('/doctor/:id (PATCH)', () => {
    it('Should return updated object', async () => {
      const user = await prisma.user.create({ data: { id: randomUUID(), ...userStub() } });
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      const doctorData = {
        id: randomUUID(),
        ...doctorStub(),
        userId: user.id,
        hospitalIds: [hospital.id],
        specializationIds: [specialization.id],
      };

      const { id } = await prisma.doctor.create({ data: doctorData });

      const body = { about: 'Lorem ipsum text...' };
      const response = await request(app.getHttpServer()).patch(`/doctor/${id}`).send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ ...doctorStub(), ...body });
    });
  });

  describe('/doctor/:id (DELETE)', () => {
    it('Should delete doctor', async () => {
      const user = await prisma.user.create({ data: { id: randomUUID(), ...userStub() } });
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });

      const doctorData = {
        id: randomUUID(),
        ...doctorStub(),
        userId: user.id,
        hospitalIds: [hospital.id],
        specializationIds: [specialization.id],
      };

      const { id } = await prisma.doctor.create({ data: doctorData });

      const response = await request(app.getHttpServer()).delete(`/doctor/${id}`);

      expect(response.status).toEqual(200);
    });
  });

  describe('/doctor/doctors/my (GET)', () => {
    it('Should doctors the patient had appointments with', async () => {
      const doctorUser = await prisma.user.create({ data: { id: randomUUID(), ...userStub() } });
      const specialization = await prisma.specialization.create({
        data: { id: randomUUID(), ...specializationStub() },
      });
      const hospital = await prisma.hospital.create({ data: { id: randomUUID(), ...hospitalStub() } });
      const doctor = await prisma.doctor.create({
        data: {
          id: randomUUID(),
          ...doctorStub(),
          specializations: { connect: { id: specialization.id } },
          hospitals: { connect: { id: hospital.id } },
          user: { connect: { id: doctorUser.id } },
        },
      });

      await prisma.appointment.create({
        data: {
          id: randomUUID(),
          ...appointmentStub(),
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });

      const response = await request(app.getHttpServer()).get('/doctor/doctors/my').set('Cookie', [patientJWTCookie]);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([
        {
          ...doctorStub(),
          firstName: userStub().firstName,
          lastName: userStub().lastName,
        },
      ]);
    });
  });

  afterAll(() => app.close());
});
