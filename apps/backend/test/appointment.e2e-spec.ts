import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { doctorStub } from 'src/doctor/doctor.stub';
import { patientStub } from 'src/patient/patient.stub';
import { PrismaService } from 'src/prisma/prisma.service';
import { userStub } from 'src/user/user.stub';
import { appointmentStub } from 'src/appointment/appointment.stub';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { mockConfigs, pipe } from '../src/utils/test-injection-mock';
import { UserModule } from '../src/user/user.module';
import { ConfigModule } from '@nestjs/config';

describe('AppointmentController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user;
  let patient;
  let doctor;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ConfigModule, AppointmentModule, EventEmitterModule.forRoot()],
      providers: [PrismaService],
    })
      .overrideProvider('SUMMARIZER_SERVICE')
      .useValue({ connect: jest.fn() })
      .overrideProvider('MAIL_SERVICE')
      .useValue({ connect: jest.fn() })
      .useMocker(pipe(mockConfigs))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    user = await prisma.user.create({ data: userStub() });
    patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
    doctor = await prisma.doctor.create({
      data: {
        ...doctorStub(),
        user: { connect: { id: user.id } },
        doctorSchedule: { create: { startsWorkHourUTC: 4, endsWorkHourUTC: 20 } },
      },
    });
  });

  describe('/appointment (POST)', () => {
    it('should create a new appointment', async () => {
      const data = {
        doctorId: doctor.id,
        patientId: patient.id,
        createdAt: '2024-04-29T07:58:54.171Z',
        status: AppointmentStatus.PLANNED,
        notes: '',
        paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
        paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
        startedAt: '2024-04-29T07:50:50.171Z',
        endedAt: '2024-04-29T08:50:50.171Z',
      };

      return await request(app.getHttpServer())
        .post('/appointment')
        .send(data)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(data);
        });
    });
  });

  describe('/appointment (GET)', () => {
    it('should return an appointment list', async () => {
      const appointment = await prisma.appointment.create({
        data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
      });

      const expected = [
        {
          id: appointment.id,
          doctorId: doctor.id,
          patientId: patient.id,
          createdAt: '2024-04-29T07:58:54.171Z',
          status: AppointmentStatus.PLANNED,
          notes: '',
          paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
          paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
          startedAt: '2024-04-29T07:50:50.171Z',
          endedAt: '2024-04-29T08:50:50.171Z',
          videoRecordKey: null,
        },
      ];

      return await request(app.getHttpServer())
        .get('/appointment')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(expected);
        });
    });

    it('should return an appointment list by patient id', async () => {
      const appointment = await prisma.appointment.create({
        data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
      });

      const expected = [
        {
          id: appointment.id,
          doctorId: doctor.id,
          doctor: {
            ...doctor,
            specializations: [],
            hospitals: [],
          },
          patientId: patient.id,
          createdAt: '2024-04-29T07:58:54.171Z',
          status: AppointmentStatus.PLANNED,
          notes: '',
          paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
          paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
          startedAt: '2024-04-29T07:50:50.171Z',
          endedAt: '2024-04-29T08:50:50.171Z',
          videoRecordKey: null,
        },
      ];

      return await request(app.getHttpServer())
        .get(`/appointment/patient/${patient.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(expected);
        });
    });

    it('should return an appointment list by doctor id', async () => {
      const appointment = await prisma.appointment.create({
        data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
      });

      const expected = [
        {
          id: appointment.id,
          doctorId: doctor.id,
          patientId: patient.id,
          patient: {
            ...patient,
          },
          createdAt: '2024-04-29T07:58:54.171Z',
          status: AppointmentStatus.PLANNED,
          notes: '',
          paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
          paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
          startedAt: '2024-04-29T07:50:50.171Z',
          endedAt: '2024-04-29T08:50:50.171Z',
          videoRecordKey: null,
        },
      ];

      return await request(app.getHttpServer())
        .get(`/appointment/doctor/${doctor.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(expected);
        });
    });

    it('should return an appointment id', async () => {
      const appointment = await prisma.appointment.create({
        data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
      });

      const expected = {
        createdAt: '2024-04-29T07:58:54.171Z',
        status: AppointmentStatus.PLANNED,
        notes: '',
        paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
        paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
        startedAt: '2024-04-29T07:50:50.171Z',
        endedAt: '2024-04-29T08:50:50.171Z',
      };

      return await request(app.getHttpServer())
        .get(`/appointment/${appointment.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(expected);
        });
    });
  });

  describe('/appointment/:id (PATCH)', () => {
    it('should update information about appointment', async () => {
      const appointment = await prisma.appointment.create({
        data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
      });

      const newData = {
        status: AppointmentStatus.CANCELED,
        notes: 'New notes about this appointment',
      };

      return await request(app.getHttpServer())
        .patch(`/appointment/${appointment.id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(newData);
        });
    });
  });

  describe('/appointment/:id (DELETE)', () => {
    it('should delete an appointment', async () => {
      const appointment = await prisma.appointment.create({
        data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
      });

      return await request(app.getHttpServer()).delete(`/appointment/${appointment.id}`).expect(200);
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.appointment.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });
});
